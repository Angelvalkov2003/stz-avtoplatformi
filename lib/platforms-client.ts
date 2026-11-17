export function platformImageDir(slug: string): string {
  if (slug === "ravna-5m") return "platform-1";
  if (slug === "malka-4-5m") return "platform-2";
  if (slug === "dalga-6m") return "platform-3";
  return "platform-1";
}

export function platformHeroImage(slug: string): string {
  return `/images/platforms/${platformImageDir(slug)}/hero.jpg`;
}

export function platformImages(slug: string, count: number): string[] {
  const dir = platformImageDir(slug);
  const max = dir === "platform-3" ? 6 : 7;
  const n = Math.min(count, max);
  const gallery = Array.from({ length: n }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return `/images/platforms/${dir}/${num}.webp`;
  });
  return [platformHeroImage(slug), ...gallery].slice(0, count + 1);
}

export function allPlatformImages(slug: string): string[] {
  const dir = platformImageDir(slug);
  const max = dir === "platform-3" ? 6 : 7;
  const gallery = Array.from({ length: max }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return `/images/platforms/${dir}/${num}.webp`;
  });
  return [platformHeroImage(slug), ...gallery];
}
