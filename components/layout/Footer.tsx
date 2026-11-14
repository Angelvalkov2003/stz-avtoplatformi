import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-silver bg-graphite text-silver">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-display text-lg text-white">{siteConfig.name}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed">
            Наем на автомобилни платформи с документи за България и чужбина.
          </p>
        </div>
        <div className="text-sm leading-7">
          <p className="text-white">Контакти</p>
          <a href={siteConfig.phoneHref} className="tabular block hover:text-accent">
            {siteConfig.phone}
          </a>
          <p>{siteConfig.address}</p>
          <p>{siteConfig.workingHours}</p>
          <a href={`mailto:${siteConfig.email}`} className="block hover:text-accent">
            {siteConfig.email}
          </a>
        </div>
        <div className="text-sm leading-7">
          <p className="text-white">Информация</p>
          <Link href="/usloviya" className="block hover:text-accent">
            Условия за наем
          </Link>
          <p className="mt-4 text-xs text-steel">
            {siteConfig.paymentNote}
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-steel md:px-6">
          <p>© {new Date().getFullYear()} {siteConfig.name}</p>
          <div className="hazard h-2 w-24" aria-hidden />
        </div>
      </div>
    </footer>
  );
}
