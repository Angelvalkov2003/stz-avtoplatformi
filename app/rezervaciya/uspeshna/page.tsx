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
    name?: string;
    platform?: string;
  }>;
};

function formatBg(iso?: string) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export default async function BookingSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const from = formatBg(params.from);
  const to = formatBg(params.to);
  const name = params.name?.trim();
  const platform = params.platform?.trim();
  const period =
    from && to ? (from === to ? from : `${from} – ${to}`) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6 md:py-24">
      <div className="border border-silver bg-white">
        <div className="h-1.5 bg-accent" aria-hidden />
        <div className="border-b border-silver bg-graphite px-5 py-6 text-white md:px-8">
          <p className="tabular text-xs text-silver">01 / потвърждение</p>
          <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
            Твоята резервация е приета
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
            . Чакаме те на уговорената дата да вземеш платформата.
          </p>

          {period ? (
            <div className="border border-silver bg-warm px-4 py-4">
              <p className="text-xs text-steel">Период за вземане</p>
              <p className="tabular mt-1 font-display text-xl font-semibold text-graphite">
                {period}
              </p>
            </div>
          ) : null}

          <ul className="space-y-3 text-sm leading-relaxed text-steel">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
              Ще се обадим за финално потвърждение на телефона.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
              {siteConfig.paymentNote}
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
              Вземане: {siteConfig.address} · {siteConfig.workingHours}
            </li>
          </ul>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button href="/">Към началото</Button>
            <Button href={siteConfig.phoneHref} variant="ghost">
              Обади се: {siteConfig.phone}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
