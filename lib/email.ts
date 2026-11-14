import "server-only";

import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";
import { formatBgDate } from "@/lib/dates";
import { formatEur } from "@/lib/pricing";
import type { Booking, Platform } from "@/lib/types";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Липсва RESEND_API_KEY.");
  return new Resend(key);
}

function fromEmail() {
  return process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
}

function adminEmail() {
  return process.env.ADMIN_NOTIFY_EMAIL ?? siteConfig.email;
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function shell(title: string, body: string) {
  return `<!doctype html><html lang="bg"><body style="margin:0;background:#F6F6F4;font-family:Arial,sans-serif;color:#1E2125">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px"><tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #C8CCD2">
    <tr><td style="background:#1E2125;padding:16px 20px;color:#fff;font-size:18px;font-weight:700">${siteConfig.name}</td></tr>
    <tr><td style="height:6px;background:#FCBC04"></td></tr>
    <tr><td style="padding:24px 20px">
      <h1 style="margin:0 0 12px;font-size:20px">${title}</h1>
      ${body}
    </td></tr>
  </table>
  </td></tr></table></body></html>`;
}

function bookingDetails(
  booking: Booking,
  platformName: string,
) {
  const price =
    booking.estimated_total_eur != null
      ? formatEur(booking.estimated_total_eur)
      : "По договаряне";
  return `
    <p style="margin:0 0 8px"><strong>Платформа:</strong> ${platformName}</p>
    <p style="margin:0 0 8px"><strong>Период:</strong> ${formatBgDate(booking.start_date)} – ${formatBgDate(booking.end_date)}</p>
    <p style="margin:0 0 8px"><strong>Име:</strong> ${booking.customer_name}</p>
    <p style="margin:0 0 8px"><strong>Телефон:</strong> ${booking.phone}</p>
    <p style="margin:0 0 8px"><strong>Имейл:</strong> ${booking.email}</p>
    <p style="margin:0 0 8px"><strong>Товар:</strong> ${booking.cargo || "—"}</p>
    <p style="margin:0 0 8px"><strong>Бележка:</strong> ${booking.note || "—"}</p>
    <p style="margin:0 0 8px"><strong>Ориентировъчна цена:</strong> ${price}</p>
    <p style="margin:16px 0 0;font-size:13px;color:#6E737B">${siteConfig.paymentNote}</p>
  `;
}

export async function sendNewBookingEmails(
  booking: Booking,
  platform: Pick<Platform, "name">,
) {
  const resend = getResend();
  const adminHtml = shell(
    "Нова заявка за наем",
    `${bookingDetails(booking, platform.name)}
     <p style="margin:20px 0 0"><a href="${siteUrl()}/admin" style="background:#FCBC04;color:#1E2125;padding:10px 14px;text-decoration:none;font-weight:700">Отвори админ</a></p>`,
  );
  const clientHtml = shell(
    "Заявката е получена",
    `<p>Здравейте, ${booking.customer_name},</p>
     <p>Заявката е получена, ще се свържем с вас за потвърждение.</p>
     ${bookingDetails(booking, platform.name)}`,
  );

  await Promise.all([
    resend.emails.send({
      from: fromEmail(),
      to: adminEmail(),
      subject: `Нова заявка — ${platform.name}`,
      html: adminHtml,
    }),
    resend.emails.send({
      from: fromEmail(),
      to: booking.email,
      subject: `Заявката е получена — ${siteConfig.name}`,
      html: clientHtml,
    }),
  ]);
}

export async function sendStatusEmail(
  booking: Booking,
  platformName: string,
  status: "confirmed" | "cancelled",
) {
  const resend = getResend();
  const title =
    status === "confirmed"
      ? "Резервацията е потвърдена"
      : "Резервацията е отказана";
  const intro =
    status === "confirmed"
      ? "Потвърждаваме вашата резервация. Ще уточним детайлите по телефона при нужда."
      : "За съжаление тази заявка е отказана. Обадете ни се, ако искате друг период.";

  await resend.emails.send({
    from: fromEmail(),
    to: booking.email,
    subject: `${title} — ${siteConfig.name}`,
    html: shell(
      title,
      `<p>Здравейте, ${booking.customer_name},</p><p>${intro}</p>${bookingDetails(booking, platformName)}`,
    ),
  });
}
