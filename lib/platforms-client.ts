export function platformImageDir(slug: string): string {
  if (slug === "ravna-5m") return "platform-1";
  if (slug === "malka-4-5m") return "platform-2";
  if (slug === "dalga-6m") return "platform-3";
  return "platform-1";
}

export function platformHeroImage(slug: string): string {
  return `/images/platforms/${platformImageDir(slug)}/hero.jpg`;
}

/** Gallery files per platform folder (without hero). */
const GALLERY_FILES: Record<string, string[]> = {
  "platform-1": [
    "01.webp",
    "02.webp",
    "03.webp",
    "04.webp",
    "05.webp",
    "06.webp",
    "07.webp",
  ],
  "platform-2": [
    "01.jpg",
    "02.jpg",
    "03.jpg",
    "04.jpg",
    "05.jpg",
    "06.jpg",
  ],
  "platform-3": [
    "01.webp",
    "02.webp",
    "03.webp",
    "04.webp",
    "05.webp",
    "06.jpg",
  ],
};

function galleryPaths(dir: string): string[] {
  return (GALLERY_FILES[dir] ?? []).map(
    (file) => `/images/platforms/${dir}/${file}`,
  );
}

export function platformImages(slug: string, count: number): string[] {
  const dir = platformImageDir(slug);
  const gallery = galleryPaths(dir).slice(0, count);
  return [platformHeroImage(slug), ...gallery];
}

export function allPlatformImages(slug: string): string[] {
  const dir = platformImageDir(slug);
  return [platformHeroImage(slug), ...galleryPaths(dir)];
}
