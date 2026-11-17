import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { termsSections, termsTitle } from "@/lib/terms";

export const metadata: Metadata = {
  title: "Общи условия",
  description: "Общи условия за използване на уебсайта на СТЗ Автоплатформи.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
      <p className="font-mono text-xs tracking-[0.16em] text-steel uppercase">
        Документ · 01
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">
        {termsTitle}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-steel">
        Актуална версия за {siteConfig.name}. С използването на сайта и
        изпращането на запитване приемате тези условия.
      </p>

      <div className="mt-10 space-y-6">
        {termsSections.map((section) => (
          <section
            key={section.n}
            className="border border-silver bg-white"
          >
            <div className="flex items-baseline gap-3 border-b border-silver bg-warm px-4 py-3 md:px-5">
              <span className="font-mono text-xs tabular text-steel">
                {section.n}
              </span>
              <h2 className="font-display text-base font-semibold md:text-lg">
                {section.title}
              </h2>
            </div>
            <ol className="space-y-4 px-4 py-5 text-sm leading-relaxed text-graphite md:px-5">
              {section.items.map((item) => (
                <li key={item.id} className="grid gap-1 sm:grid-cols-[3.25rem_1fr]">
                  <span className="font-mono text-xs tabular text-steel">
                    {item.id}
                  </span>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <p className="mt-10 border-t border-silver pt-6 text-sm text-steel">
        Контакт:{" "}
        <a href={siteConfig.phoneHref} className="underline hover:text-graphite">
          {siteConfig.phone}
        </a>
        {" · "}
        <a
          href={`mailto:${siteConfig.email}`}
          className="underline hover:text-graphite"
        >
          {siteConfig.email}
        </a>
      </p>
    </div>
  );
}
