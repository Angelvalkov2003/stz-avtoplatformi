export function platformImageDir(slug: string): string {
  if (slug === "ravna-5m") return "platform-1";
  if (slug === "malka-4-5m") return "platform-2";
  if (slug === "dalga-6m") return "platform-3";
  return "platform-1";
}

export function platformImages(slug: string, count: number): string[] {
  const dir = platformImageDir(slug);
  const max =
    dir === "platform-3" ? 6 : 7;
  const n = Math.min(count, max);
  return Array.from({ length: n }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return `/images/platforms/${dir}/${num}.webp`;
  });
}

export function allPlatformImages(slug: string): string[] {
  const dir = platformImageDir(slug);
  const max = dir === "platform-3" ? 6 : 7;
  return platformImages(slug, max);
}
