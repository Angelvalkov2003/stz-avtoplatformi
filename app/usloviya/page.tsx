import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Условия за наем",
  description: "Базови условия за наем на автомобилни платформи.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
      <p className="mb-3 inline-block bg-accent px-2 py-1 text-xs font-medium text-graphite">
        TODO: преглед от собственика
      </p>
      <h1 className="font-display text-3xl font-semibold">Условия за наем</h1>
      <p className="mt-3 text-sm text-steel">
        Кратки базови правила. Финалният текст подлежи на преглед.
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed">
        <section className="border border-silver p-5">
          <h2 className="font-display text-lg font-semibold">Документ за самоличност</h2>
          <p className="mt-2 text-steel">
            При вземане на платформата е необходим валиден документ за
            самоличност. {/* TODO: уточнете изискванията */}
          </p>
        </section>
        <section className="border border-silver p-5">
          <h2 className="font-display text-lg font-semibold">Плащане</h2>
          <p className="mt-2 text-steel">{siteConfig.paymentNote}</p>
        </section>
        <section className="border border-silver p-5">
          <h2 className="font-display text-lg font-semibold">Промени и откази</h2>
          <p className="mt-2 text-steel">
            Промени и откази се уреждат по телефона:{" "}
            <a href={siteConfig.phoneHref} className="underline">
              {siteConfig.phone}
            </a>
            . {/* TODO: уточнете срокове и евентуални такси */}
          </p>
        </section>
        <section className="border border-silver p-5">
          <h2 className="font-display text-lg font-semibold">Цени</h2>
          <p className="mt-2 text-steel">{siteConfig.priceDisclaimer}</p>
        </section>
      </div>
    </div>
  );
}
