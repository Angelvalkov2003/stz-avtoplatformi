import { siteConfig } from "@/lib/site-config";

export function IncludedSection() {
  return (
    <section className="border-b border-silver bg-graphite text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="tabular text-sm text-silver">03</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Включено оборудване
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-silver">
              Всичко нужно за товарене и път — стандартно с всяка платформа.
              Без доплащане за основния комплект.
            </p>
            <div className="mt-8 hazard h-2 w-28" aria-hidden />
          </div>

          <ol className="border border-white/15">
            {siteConfig.included.map((item, i) => (
              <li
                key={item}
                className="grid grid-cols-[3.5rem_1fr] border-b border-white/15 last:border-b-0"
              >
                <span className="tabular flex items-center justify-center border-r border-white/15 bg-white/5 text-sm text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="px-4 py-4 text-sm font-medium leading-snug md:px-5 md:text-base">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 grid gap-0 border border-accent md:grid-cols-[7rem_1fr]">
          <div className="flex items-center justify-center bg-accent px-4 py-6 md:py-0">
            <span className="font-display text-5xl font-semibold leading-none text-graphite md:text-6xl">
              Е
            </span>
          </div>
          <div className="bg-white px-5 py-5 text-graphite md:px-7 md:py-6">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-steel">
              Задължително изискване
            </p>
            <p className="mt-2 font-display text-xl font-semibold leading-snug md:text-2xl">
              {siteConfig.licenseNote}
            </p>
            <p className="mt-2 text-sm text-steel">
              Валидна B+E, C1+E или C+E според автомобила и масата на ремаркето.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
