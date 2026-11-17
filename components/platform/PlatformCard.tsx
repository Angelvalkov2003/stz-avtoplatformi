import Image from "next/image";
import Link from "next/link";
import { formatEur } from "@/lib/pricing";
import { platformHeroImage } from "@/lib/platforms-client";
import type { PlatformWithPrices } from "@/lib/types";

type Props = {
  platform: PlatformWithPrices;
  index: number;
};

export function PlatformCard({ platform, index }: Props) {
  const img = platformHeroImage(platform.slug);
  const from = platform.prices.find((p) => p.days === 1)?.total_eur;

  return (
    <article className="group grid border border-silver bg-white md:grid-cols-[1.1fr_0.9fr]">
      <Link
        href={`/platformi/${platform.slug}`}
        className="relative aspect-[4/3] overflow-hidden bg-warm md:aspect-auto md:min-h-[260px]"
      >
        <Image
          src={img}
          alt={platform.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width:768px) 100vw, 40vw"
        />
        <span className="absolute left-3 top-3 tabular bg-graphite px-2 py-1 text-xs text-white">
          {String(index + 1).padStart(2, "0")}
        </span>
      </Link>
      <div className="flex flex-col justify-between gap-4 border-t border-silver p-5 md:border-l md:border-t-0 md:p-6">
        <div>
          <h3 className="font-display text-xl font-semibold text-graphite">
            <Link href={`/platformi/${platform.slug}`} className="hover:underline">
              {platform.name}
            </Link>
          </h3>
          {platform.highlight ? (
            <p className="mt-2 inline-block bg-accent px-2 py-1 text-xs font-medium text-graphite">
              {platform.highlight}
            </p>
          ) : null}
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-steel">Размери</dt>
              <dd className="tabular mt-0.5 font-medium">
                {Number(platform.length_m).toFixed(2)} ×{" "}
                {Number(platform.width_m).toFixed(2)} м
              </dd>
            </div>
            <div>
              <dt className="text-steel">Товароносимост</dt>
              <dd className="tabular mt-0.5 font-medium">
                {platform.capacity_kg} кг
              </dd>
            </div>
            <div>
              <dt className="text-steel">Цена от</dt>
              <dd className="tabular mt-0.5 font-medium">
                {from != null ? formatEur(from) : "—"} / ден
              </dd>
            </div>
          </dl>
        </div>
        <Link
          href={`/platformi/${platform.slug}`}
          className="inline-flex w-fit items-center border-b border-accent pb-0.5 text-sm font-medium text-graphite"
        >
          Виж платформата
        </Link>
      </div>
    </article>
  );
}
