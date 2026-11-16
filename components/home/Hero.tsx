import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

export function Hero() {
  return (
    <section className="relative isolate min-h-[78vh] overflow-hidden bg-graphite text-white">
      <Image
        src="/images/platforms/platform-1/01.webp"
        alt="Автомобилна платформа на СТЗ"
        fill
        priority
        className="object-cover opacity-55"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/80 to-graphite/35" />
      <div className="absolute inset-x-0 bottom-0 h-3 hazard opacity-90" aria-hidden />

      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 md:px-6 md:pb-20">
        <p className="font-display text-sm tracking-[0.18em] text-accent md:text-base">
          {siteConfig.name}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold uppercase leading-[1.05] md:text-6xl">
          Автомобилни платформи под наем
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-silver md:text-lg">
          Бърза резервация онлайн или по телефона
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/#platformi" className="min-w-[10rem]">
            Резервирай сега
          </Button>
          <Button
            href={siteConfig.phoneHref}
            variant="ghost"
            className="min-w-[10rem] border-silver text-white hover:border-accent"
          >
            Обади ни се
          </Button>
        </div>
      </div>
    </section>
  );
}
