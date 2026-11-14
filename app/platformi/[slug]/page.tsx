import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking/BookingForm";
import { Gallery } from "@/components/platform/Gallery";
import { PlatformViewer } from "@/components/platform/PlatformViewer";
import { PriceTable } from "@/components/platform/PriceTable";
import { TechDrawing } from "@/components/platform/TechDrawing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getBusyRanges } from "@/lib/bookings";
import { formatEur } from "@/lib/pricing";
import { allPlatformImages, getPlatformBySlug, getPlatforms } from "@/lib/platforms";
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
        images: [allPlatformImages(p.slug)[0]],
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
  const from = platform.prices.find((x) => x.days === 1)?.total_eur;

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

      <section className="border-b border-silver bg-graphite text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <p className="tabular text-sm text-silver">
            {String(platform.sort_order).padStart(2, "0")} / платформа
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold md:text-5xl">
            {platform.name}
          </h1>
          {platform.highlight ? (
            <p className="mt-4 inline-block bg-accent px-3 py-1.5 text-sm font-medium text-graphite">
              {platform.highlight}
            </p>
          ) : null}
          <p className="mt-4 max-w-2xl text-silver">{platform.description}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <Gallery images={images} alt={platform.name} />

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading title="3D модел" className="mb-4" />
            <PlatformViewer
              slug={platform.slug}
              lengthM={Number(platform.length_m)}
              widthM={Number(platform.width_m)}
              fallbackImage={images[0]}
              name={platform.name}
            />
          </div>
          <div>
            <SectionHeading title="Характеристики" className="mb-4" />
            <dl className="border border-silver">
              {[
                [
                  "Размери",
                  `${Number(platform.length_m).toFixed(2)} × ${Number(platform.width_m).toFixed(2)} м`,
                ],
                ["Товароносимост", `${platform.capacity_kg} кг`],
                [
                  "Собствена маса",
                  platform.curb_weight_kg != null
                    ? `~${platform.curb_weight_kg} кг`
                    : "—",
                ],
                [
                  "Допустим товар",
                  platform.payload_kg != null
                    ? `~${platform.payload_kg} кг`
                    : "—",
                ],
                [
                  "Цена от",
                  from != null ? `${formatEur(from)} / ден` : "—",
                ],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-2 border-b border-silver last:border-b-0"
                >
                  <dt className="bg-warm px-4 py-3 text-sm text-steel">{k}</dt>
                  <dd className="tabular px-4 py-3 text-sm font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <TechDrawing
                lengthM={Number(platform.length_m)}
                widthM={Number(platform.width_m)}
                name={platform.name}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading title="Подходяща за" className="mb-4" />
            <ul className="space-y-2 border border-silver bg-warm p-5">
              {platform.suitable_for.map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <SectionHeading title="Ценоразпис" className="mb-4" />
              <PriceTable prices={platform.prices} />
            </div>
          </div>
          <div id="rezervaciya">
            <BookingForm
              platformId={platform.id}
              prices={platform.prices}
              initialBusy={busy}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
