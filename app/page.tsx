import { FaqSection } from "@/components/home/FaqSection";
import { Hero } from "@/components/home/Hero";
import { IncludedSection } from "@/components/home/IncludedSection";
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
              platforms.map((p) => (
                <PlatformCard key={p.id} platform={p} />
              ))
            )}
          </div>
        </div>
      </section>

      <section id="kak-raboti" className="border-b border-silver bg-warm">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <SectionHeading
            title="Как работи"
            description="Кратък процес — без онлайн плащане."
          />
          <ol className="mt-10 grid gap-0 border border-silver bg-white md:grid-cols-3">
            {[
              {
                n: "I",
                t: "Избираш дати",
                d: "Избираш от календара на платформата желания период и пращаш заявка.",
              },
              {
                n: "II",
                t: "Потвърждаваме по телефона",
                d: "Обаждаме се, уточняваме товара и запазваме периода.",
              },
              {
                n: "III",
                t: "Очакваме те",
                d: "Очакваме те в уговорения ден и час да закачиш платформата.",
              },
            ].map((s) => (
              <li
                key={s.n}
                className="group relative border-silver p-6 md:border-r md:last:border-r-0 border-b md:border-b-0 md:p-8"
              >
                <div className="absolute left-0 top-0 h-1 w-10 bg-accent opacity-80 transition group-hover:w-16" />
                <p className="font-display text-3xl font-semibold leading-none tracking-tight text-accent md:text-4xl">
                  {s.n}
                </p>
                <h3 className="mt-5 font-display text-lg font-semibold text-graphite">
                  {s.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <IncludedSection />

      <FaqSection />

      <section id="kontakti" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <SectionHeading title="Контакти" />
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
                      Пишете ни във Viber
                    </a>
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
                  title="Карта — STZ Автомобилни Платформи под Наем"
                  src={siteConfig.mapsEmbedUrl}
                  className="h-full min-h-[280px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : null}
              {siteConfig.mapsLink ? (
                <div className="border-t border-silver bg-white px-4 py-3">
                  <Button
                    href={siteConfig.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    Отвори в Google Maps
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
