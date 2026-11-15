"use server";

import { redirect } from "next/navigation";
import { createBooking, isExclusionConflict } from "@/lib/bookings";
import { sofiaToday, parseISODate } from "@/lib/dates";
import { sendNewBookingEmails } from "@/lib/email";
import { estimatePrice, countInclusiveDays } from "@/lib/pricing";
import { getPlatforms } from "@/lib/platforms";
import { bookingFormSchema } from "@/lib/validators";

export type BookingActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitBooking(
  _prev: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const raw = {
    platformId: String(formData.get("platformId") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    customerName: String(formData.get("customerName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    cargo: String(formData.get("cargo") ?? ""),
    note: String(formData.get("note") ?? ""),
    acceptTerms: formData.get("acceptTerms") === "on" ? true : false,
    website: String(formData.get("website") ?? ""),
  };

  if (raw.website) {
    return { ok: true };
  }

  const parsed = bookingFormSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Record<
      string,
      string[]
    >;
    const first =
      fieldErrors.phone?.[0] ||
      fieldErrors.email?.[0] ||
      fieldErrors.customerName?.[0] ||
      fieldErrors.acceptTerms?.[0] ||
      fieldErrors.startDate?.[0] ||
      fieldErrors.platformId?.[0] ||
      "Проверете полетата във формата.";
    return { ok: false, message: first, fieldErrors };
  }

  const data = parsed.data;
  if (data.endDate < data.startDate) {
    return { ok: false, message: "Крайната дата трябва да е след началната." };
  }
  if (data.startDate < sofiaToday()) {
    return { ok: false, message: "Началната дата не може да е в миналото." };
  }

  const platforms = await getPlatforms();
  const platform = platforms.find((p) => p.id === data.platformId);
  if (!platform) {
    return { ok: false, message: "Платформата не е намерена." };
  }

  const days = countInclusiveDays(
    parseISODate(data.startDate),
    parseISODate(data.endDate),
  );
  const price = estimatePrice(days, platform.prices);

  const { data: booking, error } = await createBooking({
    platform_id: data.platformId,
    start_date: data.startDate,
    end_date: data.endDate,
    customer_name: data.customerName,
    phone: data.phone,
    email: data.email,
    cargo: data.cargo || null,
    note: data.note || null,
    estimated_total_eur: price.totalEur,
    source: "web",
    status: "pending",
  });

  if (error || !booking) {
    if (isExclusionConflict(error)) {
      return {
        ok: false,
        message: "Някои от избраните дни току-що бяха заети",
      };
    }
    return { ok: false, message: "Грешка при запис. Опитайте отново." };
  }

  try {
    await sendNewBookingEmails(booking, platform);
  } catch {
    // заявката е записана; имейлът не трябва да блокира успеха
  }

  const q = new URLSearchParams({
    from: data.startDate,
    to: data.endDate,
    name: data.customerName,
    platform: platform.name,
  });
  redirect(`/rezervaciya/uspeshna?${q.toString()}`);
}
