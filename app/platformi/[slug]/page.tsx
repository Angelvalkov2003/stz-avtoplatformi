import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking/BookingForm";
import { Gallery } from "@/components/platform/Gallery";
import { PriceTable } from "@/components/platform/PriceTable";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getBusyRanges } from "@/lib/bookings";
import { formatEur } from "@/lib/pricing";
import {
  allPlatformImages,
  getPlatformBySlug,
} from "@/lib/platforms";
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
        images: [
          {
            url: "/images/logo-photo.jpg",
            alt: siteConfig.name,
          },
        ],
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
  const from = platform.prices.find((x) => x.days === 1)?.total_eur;

  const specs: [string, string][] = [
    [
      "Размери (Д × Ш)",
      `${Number(platform.length_m).toFixed(2)} × ${Number(platform.width_m).toFixed(2)} м`,
    ],
    ["Дължина", `${Number(platform.length_m).toFixed(2)} м`],
    ["Ширина", `${Number(platform.width_m).toFixed(2)} м`],
    ["Товароносимост", `${platform.capacity_kg} кг`],
    [
      "Собствена маса",
      platform.curb_weight_kg != null ? `~${platform.curb_weight_kg} кг` : "—",
    ],
    [
      "Допустим товар",
      platform.payload_kg != null ? `~${platform.payload_kg} кг` : "—",
    ],
    ["Цена от", from != null ? `${formatEur(from)} / ден` : "—"],
    ["Документи", "България и чужбина"],
    ["Включено", "Лебедка, резервна гума, колани"],
  ];

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
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Gallery images={images} alt={platform.name} />

          <div>
            <SectionHeading title="Характеристики" className="mb-4" />
            <div className="overflow-hidden border border-silver">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  Технически характеристики на {platform.name}
                </caption>
                <tbody>
                  {specs.map(([k, v], i) => (
                    <tr
                      key={k}
                      className={i % 2 === 0 ? "bg-white" : "bg-warm"}
                    >
                      <th
                        scope="row"
                        className="border-b border-silver px-4 py-3 font-medium text-steel"
                      >
                        {k}
                      </th>
                      <td className="tabular border-b border-silver px-4 py-3 font-medium text-graphite">
                        {v}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-graphite">
                Подходяща за
              </p>
              <ul className="space-y-2 border border-silver bg-warm p-4">
                {platform.suitable_for.map((item) => (
                  <li key={item} className="flex gap-3 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading title="Ценоразпис" className="mb-4" />
            <PriceTable prices={platform.prices} />
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
