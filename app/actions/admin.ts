"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkLoginRateLimit,
  clearAdminSessionCookie,
  isAdminAuthenticated,
  setAdminSessionCookie,
  verifyPassword,
} from "@/lib/admin-auth";
import {
  createBooking,
  deleteBooking,
  getBookingById,
  isExclusionConflict,
  updateBookingStatus,
} from "@/lib/bookings";
import { sendStatusEmail } from "@/lib/email";
import { estimatePrice, countInclusiveDays } from "@/lib/pricing";
import { parseISODate } from "@/lib/dates";
import { getPlatforms } from "@/lib/platforms";
import { adminManualSchema } from "@/lib/validators";
import type { BookingStatus } from "@/lib/types";

export type AdminState = { ok: boolean; message?: string };

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Неоторизиран достъп");
  }
}

export async function loginAction(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";

  if (!checkLoginRateLimit(ip)) {
    return { ok: false, message: "Твърде много опити. Опитайте след 15 минути." };
  }

  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    return { ok: false, message: "Грешна парола." };
  }

  await setAdminSessionCookie();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}

export async function setBookingStatusAction(
  id: string,
  status: BookingStatus,
): Promise<AdminState> {
  await requireAdmin();
  const before = await getBookingById(id);
  const { data, error } = await updateBookingStatus(id, status);
  if (error || !data) return { ok: false, message: "Неуспешна промяна." };

  if (
    before &&
    (status === "confirmed" || status === "cancelled") &&
    before.email
  ) {
    try {
      await sendStatusEmail(
        data,
        before.platform?.name ?? "Платформа",
        status,
      );
    } catch {
      /* ignore email errors */
    }
  }

  return { ok: true };
}

export async function deleteBookingAction(id: string): Promise<AdminState> {
  await requireAdmin();
  const { error } = await deleteBooking(id);
  if (error) return { ok: false, message: "Неуспешно изтриване." };
  return { ok: true };
}

export async function createManualBookingAction(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireAdmin();

  const raw = {
    platformId: String(formData.get("platformId") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    status: String(formData.get("status") ?? "confirmed"),
    customerName: String(formData.get("customerName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    cargo: String(formData.get("cargo") ?? ""),
    note: String(formData.get("note") ?? ""),
  };

  const parsed = adminManualSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Невалидни данни." };
  }

  const data = parsed.data;
  if (data.endDate < data.startDate) {
    return { ok: false, message: "Невалиден период." };
  }

  const platforms = await getPlatforms();
  const platform = platforms.find((p) => p.id === data.platformId);
  if (!platform) return { ok: false, message: "Липсва платформа." };

  const days = countInclusiveDays(
    parseISODate(data.startDate),
    parseISODate(data.endDate),
  );
  const price = estimatePrice(days, platform.prices);

  const { error } = await createBooking({
    platform_id: data.platformId,
    start_date: data.startDate,
    end_date: data.endDate,
    status: data.status,
    customer_name:
      data.status === "blocked"
        ? data.customerName || "Блокирани дни"
        : data.customerName || "Ръчна резервация",
    phone: data.phone || "—",
    email: data.email || "admin@local",
    cargo: data.cargo || null,
    note: data.note || null,
    estimated_total_eur: price.totalEur,
    source: "admin",
  });

  if (error) {
    if (isExclusionConflict(error)) {
      return { ok: false, message: "Някои от избраните дни току-що бяха заети" };
    }
    return { ok: false, message: "Грешка при запис." };
  }

  return { ok: true, message: "Записано." };
}
