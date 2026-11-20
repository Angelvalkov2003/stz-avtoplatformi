import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlatformView } from "@/components/platform/PlatformView";
import { getBusyRanges } from "@/lib/bookings";
import {
  allPlatformImages,
  getPlatformBySlug,
} from "@/lib/platforms";
import { fromDailyPrice } from "@/lib/pricing";
import { siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const p = await getPlatformBySlug(slug);
    if (!p) return { title: "Платформа" };
    return {
      title: p.name,
      description: p.description,
      openGraph: {
        title: p.name,
        description: p.description,
        images: [{ url: "/images/logo-photo.jpg", alt: siteConfig.name }],
      },
      twitter: {
        card: "summary_large_image",
        images: ["/images/logo-photo.jpg"],
      },
    };
  } catch {
    return { title: "Платформа" };
  }
}

export default async function PlatformPage({ params }: Props) {
  const { slug } = await params;
  const platform = await getPlatformBySlug(slug).catch(() => null);
  if (!platform) notFound();

  const images = allPlatformImages(platform.slug);
  const busy = await getBusyRanges(platform.id).catch(() => []);
  const from = fromDailyPrice(platform.prices);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: platform.name,
    description: platform.description,
    image: images.map((u) => `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}${u}`),
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: from ?? undefined,
      availability: "https://schema.org/InStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/platformi/${platform.slug}`,
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlatformView platform={platform} images={images} busy={busy} />
    </div>
  );
}
