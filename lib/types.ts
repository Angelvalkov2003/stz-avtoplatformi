export type BookingStatus =
  | "pending"
  | "confirmed"
  | "blocked"
  | "completed"
  | "cancelled";

export type BookingSource = "web" | "admin";

export type PlatformPrice = {
  platform_id: string;
  days: number;
  total_eur: number;
};

export type Platform = {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  length_m: number;
  width_m: number;
  capacity_kg: number;
  curb_weight_kg: number | null;
  payload_kg: number | null;
  description: string;
  suitable_for: string[];
  highlight: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type PlatformWithPrices = Platform & {
  prices: PlatformPrice[];
};

export type Booking = {
  id: string;
  platform_id: string;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  customer_name: string;
  phone: string;
  email: string;
  cargo: string | null;
  note: string | null;
  estimated_total_eur: number | null;
  source: BookingSource;
  created_at: string;
  updated_at: string;
};

export type BookingWithPlatform = Booking & {
  platform?: Pick<Platform, "name" | "slug" | "short_name"> | null;
};
