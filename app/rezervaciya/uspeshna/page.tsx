import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Резервацията е приета",
  robots: { index: false },
};

type Props = {
  searchParams: Promise<{
    from?: string;
    to?: string;
    time?: string;
    name?: string;
    platform?: string;
    travel?: string;
  }>;
};

function formatBg(iso?: string) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function formatDayMonth(iso?: string) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [, m, d] = iso.split("-");
  return `${d}.${m}`;
}

export default async function BookingSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const from = formatBg(params.from);
  const to = formatBg(params.to);
  const dayMonth = formatDayMonth(params.from);
  const time = params.time?.match(/^\d{2}:\d{2}$/) ? params.time : null;
  const name = params.name?.trim();
  const platform = params.platform?.trim();
  const travel = params.travel?.trim();
  const period =
    from && to ? (from === to ? from : `${from} – ${to}`) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6 md:py-24">
      <div className="border border-silver bg-white">
        <div className="flex flex-col items-center border-b border-silver bg-warm px-5 py-10 text-center md:px-8">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1F7A3A] text-white"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
              <path
                d="M5 12.5 9.5 17 19 7.5"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="square"
              />
            </svg>
          </span>
          <p className="mt-4 text-sm font-medium text-[#1F7A3A]">
            Резервацията е приета успешно
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-graphite md:text-4xl">
            Чакаме те за вземане
          </h1>
        </div>

        <div className="space-y-5 px-5 py-8 md:px-8">
          <p className="text-base leading-relaxed text-graphite">
            {name ? `Здравей, ${name}. ` : null}
            Заявката е записана
            {platform ? (
              <>
                {" "}
                за <strong>{platform}</strong>
              </>
            ) : null}
            . Ще се свържем за потвърждение. Чакаме те на уговорената дата и час
            да вземеш платформата.
          </p>

          {period || time ? (
            <div className="border border-silver bg-warm px-4 py-4">
              <p className="text-xs text-steel">Период и час на вземане</p>
              {period ? (
                <p className="tabular mt-1 font-display text-xl font-semibold text-graphite">
                  {period}
                </p>
              ) : null}
              {dayMonth && time ? (
                <p className="tabular mt-1 text-sm font-medium text-graphite">
                  {dayMonth} в {time}
                </p>
              ) : null}
              {travel ? (
                <p className="mt-2 text-sm text-steel">Пътуване: {travel}</p>
              ) : null}
            </div>
          ) : null}

          <p className="text-sm text-steel">* {siteConfig.paymentNote}</p>

          <div className="border border-silver">
            <div className="border-b border-silver px-4 py-3">
              <p className="text-sm font-medium text-graphite">Място на вземане</p>
              <p className="mt-1 text-sm text-steel">{siteConfig.address}</p>
              {siteConfig.mapsLink ? (
                <Button
                  href={siteConfig.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full sm:w-auto"
                >
                  Отвори в Google Maps
                </Button>
              ) : null}
            </div>
            {siteConfig.mapsEmbedUrl ? (
              <iframe
                title="Локация за вземане"
                src={siteConfig.mapsEmbedUrl}
                className="h-56 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : null}
          </div>

          <p className="text-sm leading-relaxed text-steel">
            Имаш допълнителни въпроси? Не се колебай да ни потърсиш.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button href="/">Към началото</Button>
            <Button href={siteConfig.phoneHref} variant="ghost">
              Потърси ни
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
