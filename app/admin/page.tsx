import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getBookingsForAdmin, getUpcomingBookings } from "@/lib/bookings";
import { getPlatforms } from "@/lib/platforms";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const [platforms, bookings, upcoming] = await Promise.all([
    getPlatforms(),
    getBookingsForAdmin(),
    getUpcomingBookings(),
  ]);

  return (
    <AdminPanel
      platforms={platforms}
      bookings={bookings}
      upcoming={upcoming}
    />
  );
}
