import type { Platform } from "@/lib/types";

export const sharedEquipment = [
  "Ръчна лебедка",
  "Резервна гума",
  "4 бр. сертифицирани закрепващи колани",
  "Заключващо устройство против кражба (при желание)",
  "Преходник за букса (при необходимост)",
] as const;

export const licenseNote =
  "Платформите се дърпат задължително с категория „Е“.";

export function axleCount(platform: Pick<Platform, "length_m" | "slug">): number {
  const length = Number(platform.length_m);
  if (platform.slug === "dalga-6m" || length >= 6) return 3;
  return 2;
}

export function socketLabel(
  platform: Pick<Platform, "length_m" | "slug">,
): string {
  const length = Number(platform.length_m);
  if (platform.slug === "malka-4-5m" || (length > 4 && length < 5)) {
    return "7 пинова";
  }
  return "13 пинова";
}

export function dimensionsLabel(
  platform: Pick<Platform, "length_m" | "width_m">,
): string {
  const L = Number(platform.length_m).toFixed(2);
  const W = Number(platform.width_m).toFixed(2);
  return `${L} м дължина × ${W} м широчина`;
}
