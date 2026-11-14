import "server-only";

import { cache } from "react";
import { getSupabase } from "@/lib/supabase/server";
import type { Platform, PlatformPrice, PlatformWithPrices } from "@/lib/types";

export const getPlatforms = cache(async (): Promise<PlatformWithPrices[]> => {
  const supabase = getSupabase();
  const [{ data: platforms, error: pErr }, { data: prices, error: prErr }] =
    await Promise.all([
      supabase
        .from("platforms")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase.from("platform_prices").select("*"),
    ]);

  if (pErr) throw pErr;
  if (prErr) throw prErr;

  const byPlatform = new Map<string, PlatformPrice[]>();
  for (const row of (prices ?? []) as PlatformPrice[]) {
    const list = byPlatform.get(row.platform_id) ?? [];
    list.push(row);
    byPlatform.set(row.platform_id, list);
  }

  return ((platforms ?? []) as Platform[]).map((p) => ({
    ...p,
    prices: (byPlatform.get(p.id) ?? []).sort((a, b) => a.days - b.days),
  }));
});

export const getPlatformBySlug = cache(
  async (slug: string): Promise<PlatformWithPrices | null> => {
    const all = await getPlatforms();
    return all.find((p) => p.slug === slug) ?? null;
  },
);

export {
  allPlatformImages,
  platformImageDir,
  platformImages,
} from "@/lib/platforms-client";
