import "server-only";

import { cache } from "react";
import { getSupabase } from "@/lib/supabase/server";
import type { Booking, BookingStatus, BookingWithPlatform } from "@/lib/types";

export type CreateBookingInput = {
  platform_id: string;
  start_date: string;
  end_date: string;
  status?: BookingStatus;
  customer_name: string;
  phone: string;
  email: string;
  cargo?: string | null;
  note?: string | null;
  estimated_total_eur?: number | null;
  source?: "web" | "admin";
};

export const getBusyRanges = cache(async (platformId: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("bookings")
    .select("start_date, end_date, status")
    .eq("platform_id", platformId)
    .neq("status", "cancelled");

  if (error) throw error;
  return (data ?? []) as Pick<Booking, "start_date" | "end_date" | "status">[];
});

export async function createBooking(input: CreateBookingInput) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      platform_id: input.platform_id,
      start_date: input.start_date,
      end_date: input.end_date,
      status: input.status ?? "pending",
      customer_name: input.customer_name,
      phone: input.phone,
      email: input.email,
      cargo: input.cargo ?? null,
      note: input.note ?? null,
      estimated_total_eur: input.estimated_total_eur ?? null,
      source: input.source ?? "web",
    })
    .select("*")
    .single();

  if (error) return { data: null, error };
  return { data: data as Booking, error: null };
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return { data: null, error };
  return { data: data as Booking, error: null };
}

export async function deleteBooking(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  return { error };
}

export async function getBookingsForAdmin(opts?: {
  platformId?: string;
  from?: string;
  to?: string;
}): Promise<BookingWithPlatform[]> {
  const supabase = getSupabase();
  let q = supabase
    .from("bookings")
    .select(
      "*, platform:platforms(name, slug, short_name)",
    )
    .order("start_date", { ascending: true });

  if (opts?.platformId) q = q.eq("platform_id", opts.platformId);
  if (opts?.from) q = q.gte("end_date", opts.from);
  if (opts?.to) q = q.lte("start_date", opts.to);

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as BookingWithPlatform[];
}

export async function getUpcomingBookings(): Promise<BookingWithPlatform[]> {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Sofia",
  }).format(new Date());

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, platform:platforms(name, slug, short_name)")
    .neq("status", "cancelled")
    .gte("end_date", today)
    .order("start_date", { ascending: true })
    .limit(40);

  if (error) throw error;
  return (data ?? []) as BookingWithPlatform[];
}

export async function getBookingById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, platform:platforms(name, slug, short_name)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as BookingWithPlatform | null;
}

export function isExclusionConflict(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  if (error.code === "23P01") return true;
  return Boolean(error.message?.toLowerCase().includes("exclusion"));
}
