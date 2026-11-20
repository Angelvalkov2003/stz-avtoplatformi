export function platformImageDir(slug: string): string {
  if (slug === "ravna-5m") return "platform-1";
  if (slug === "malka-4-5m") return "platform-2";
  if (slug === "dalga-6m") return "platform-3";
  return "platform-1";
}

export function platformHeroImage(slug: string): string {
  return `/images/platforms/${platformImageDir(slug)}/hero.jpg`;
}

function galleryCount(dir: string): number {
  if (dir === "platform-2") return 0; // 4.5 м — само hero с бял фон
  if (dir === "platform-3") return 6;
  return 7;
}

export function platformImages(slug: string, count: number): string[] {
  const dir = platformImageDir(slug);
  const max = galleryCount(dir);
  const n = Math.min(count, max);
  const gallery = Array.from({ length: n }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return `/images/platforms/${dir}/${num}.webp`;
  });
  return [platformHeroImage(slug), ...gallery].slice(0, count + 1);
}

export function allPlatformImages(slug: string): string[] {
  const dir = platformImageDir(slug);
  const max = galleryCount(dir);
  const gallery = Array.from({ length: max }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return `/images/platforms/${dir}/${num}.webp`;
  });
  return [platformHeroImage(slug), ...gallery];
}
