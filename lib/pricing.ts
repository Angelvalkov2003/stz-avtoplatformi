import type { PlatformPrice } from "@/lib/types";

export type PriceResult =
  | { kind: "exact" | "estimated"; totalEur: number; label: string }
  | { kind: "negotiable"; totalEur: null; label: string };

export function countInclusiveDays(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.floor(ms / 86_400_000) + 1;
}

export function estimatePrice(
  days: number,
  prices: Pick<PlatformPrice, "days" | "total_eur">[],
): PriceResult {
  if (days < 1) {
    return { kind: "estimated", totalEur: 0, label: "ориентировъчна цена" };
  }

  if (days > 30) {
    return { kind: "negotiable", totalEur: null, label: "По договаряне" };
  }

  const sorted = [...prices].sort((a, b) => a.days - b.days);
  const exact = sorted.find((p) => p.days === days);
  if (exact) {
    return {
      kind: "exact",
      totalEur: exact.total_eur,
      label: "ориентировъчна цена",
    };
  }

  let lower: (typeof sorted)[number] | null = null;
  let higher: (typeof sorted)[number] | null = null;
  for (const row of sorted) {
    if (row.days < days) lower = row;
    if (row.days > days && !higher) higher = row;
  }

  if (!lower) {
    const first = sorted[0];
    if (!first) {
      return { kind: "negotiable", totalEur: null, label: "По договаряне" };
    }
    return {
      kind: "estimated",
      totalEur: first.total_eur,
      label: "ориентировъчна цена",
    };
  }

  const daily = lower.total_eur / lower.days;
  let total = Math.round(daily * days);
  if (higher) total = Math.min(total, higher.total_eur);

  return { kind: "estimated", totalEur: total, label: "ориентировъчна цена" };
}

export function formatEur(amount: number): string {
  return `${amount}\u00A0€`;
}

/** Най-ниска дневна ставка от ценоразписа (обикновено месечният пакет). */
export function fromDailyPrice(
  prices: Pick<PlatformPrice, "days" | "total_eur">[],
): number | null {
  if (prices.length === 0) return null;
  let best: number | null = null;
  for (const row of prices) {
    if (row.days < 1) continue;
    const daily = Math.round(row.total_eur / row.days);
    if (best == null || daily < best) best = daily;
  }
  return best;
}
