"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

export function MobileBookingBar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  const onPlatform = pathname?.startsWith("/platformi/");

  if (onPlatform) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-graphite">
        <div className="mx-auto flex max-w-6xl justify-center px-0 md:px-6 md:py-3">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center bg-accent px-4 py-4 text-sm font-semibold tracking-wide text-graphite transition hover:brightness-95 md:max-w-md md:border md:border-accent"
            onClick={() =>
              window.dispatchEvent(new Event("stz:open-booking"))
            }
          >
            Резервирай платформата
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-silver bg-white p-3 md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
        <a
          href={siteConfig.phoneHref}
          className="inline-flex items-center justify-center border border-graphite bg-graphite px-3 py-3 text-sm font-medium text-white"
        >
          Обади се
        </a>
        <a
          href="/#platformi"
          className="inline-flex items-center justify-center border border-accent bg-accent px-3 py-3 text-sm font-medium text-graphite"
        >
          Резервирай платформата
        </a>
      </div>
    </div>
  );
}
