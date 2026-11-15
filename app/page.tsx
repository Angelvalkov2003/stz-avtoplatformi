import { Hero } from "@/components/home/Hero";
import { PlatformCard } from "@/components/platform/PlatformCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { getPlatforms } from "@/lib/platforms";
import { siteConfig } from "@/lib/site-config";

export default async function HomePage() {
  let platforms: Awaited<ReturnType<typeof getPlatforms>> = [];
  try {
    platforms = await getPlatforms();
  } catch {
    platforms = [];
  }

  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: siteConfig.address,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    image: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/images/logo-photo.jpg`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
      />
      <Hero />

      <section id="platformi" className="border-b border-silver bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <SectionHeading
            number="01"
            title="Платформите"
            description="Сравнение по размери, товароносимост и начална дневна цена."
          />
          <div className="mt-10 flex flex-col gap-5">
            {platforms.length === 0 ? (
              <p className="border border-silver bg-warm p-4 text-sm text-steel">
                Няма заредени платформи. Проверете{" "}
                <code className="tabular">SUPABASE_SERVICE_ROLE_KEY</code> в
                .env.local (трябва да е service_role / sb_secret_, не
                publishable) и рестартирайте dev сървъра.
              </p>
            ) : (
              platforms.map((p, i) => (
                <PlatformCard key={p.id} platform={p} index={i} />
              ))
            )}
          </div>
        </div>
      </section>

      <section id="kak-raboti" className="border-b border-silver bg-warm">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <SectionHeading
            number="02"
            title="Как работи"
            description="Кратък процес — без онлайн плащане."
          />
          <ol className="mt-10 grid gap-0 border border-silver bg-white md:grid-cols-3">
            {[
              {
                t: "Избираш дати",
                d: "Гледаш календара на платформата и пращаш заявка за свободния период.",
              },
              {
                t: "Потвърждаваме по телефона",
                d: "Обаждаме се, уточняваме товара и запазваме периода.",
              },
              {
                t: "Плащаш в брой при вземане",
                d: siteConfig.paymentNote,
              },
            ].map((s, i) => (
              <li
                key={s.t}
                className="border-silver p-6 md:border-r md:last:border-r-0 border-b md:border-b-0"
              >
                <p className="tabular text-sm text-steel">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-silver bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <SectionHeading
            number="03"
            title="Какво е включено"
            description="Стандартно оборудване и документи с всяка платформа."
          />
          <ul className="mt-8 grid gap-px bg-silver sm:grid-cols-2">
            {siteConfig.included.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 bg-white px-5 py-4 text-sm"
              >
                <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="chzv" className="border-b border-silver bg-warm">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <SectionHeading number="04" title="Често задавани въпроси" />
          <div className="mt-8 divide-y divide-silver border border-silver bg-white">
            {[
              {
                q: "Има ли онлайн плащане?",
                a: siteConfig.paymentNote,
              },
              {
                q: "Цените финални ли са?",
                a: siteConfig.priceDisclaimer,
              },
              {
                q: "Мога ли да карам в чужбина?",
                a: "Да — платформите имат изрядни документи за транспорт в България и чужбина.",
              },
              {
                q: "Как се променя или отказва резервация?",
                a: "Промени и откази се уреждат по телефона.",
              },
            ].map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-medium marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span className="tabular text-steel group-open:hidden">+</span>
                    <span className="tabular hidden text-steel group-open:inline">−</span>
                  </span>
                </summary>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-steel">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="kontakti" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <SectionHeading number="05" title="Контакти" />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="border border-silver p-6">
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-steel">Телефон</dt>
                  <dd>
                    <a
                      href={siteConfig.phoneHref}
                      className="tabular text-lg font-medium hover:underline"
                    >
                      {siteConfig.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-steel">Адрес за вземане</dt>
                  <dd className="mt-1">{siteConfig.address}</dd>
                </div>
                <div>
                  <dt className="text-steel">Работно време</dt>
                  <dd className="mt-1">{siteConfig.workingHours}</dd>
                </div>
                <div>
                  <dt className="text-steel">Имейл</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${siteConfig.email}`} className="hover:underline">
                      {siteConfig.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-steel">Viber</dt>
                  <dd className="mt-1">
                    <a href={siteConfig.viber} className="hover:underline">
                      Съобщение в Viber
                    </a>
                    <span className="mt-1 block text-xs text-steel">
                      Само Viber на този номер — без WhatsApp.
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-steel">Facebook</dt>
                  <dd className="mt-1">
                    <a
                      href={siteConfig.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      СТЗ Автоплатформи
                    </a>
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={siteConfig.phoneHref}>Обади се</Button>
                <Button href={siteConfig.viber} variant="ghost">
                  Viber
                </Button>
              </div>
            </div>
            <div className="min-h-[280px] border border-silver bg-warm">
              {siteConfig.mapsEmbedUrl ? (
                <iframe
                  title="Карта — район Стара Загора"
                  src={siteConfig.mapsEmbedUrl}
                  className="h-full min-h-[280px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : null}
              {siteConfig.mapsLink ? (
                <p className="border-t border-silver bg-white px-4 py-2 text-xs text-steel">
                  <a
                    href={siteConfig.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-graphite"
                  >
                    Отвори в Google Maps
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
