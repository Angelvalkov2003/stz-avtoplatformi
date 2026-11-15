"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

export function MobileBookingBar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  const onPlatform = pathname?.startsWith("/platformi/");

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-silver bg-white p-3 md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
        <a
          href={siteConfig.phoneHref}
          className="inline-flex items-center justify-center border border-graphite bg-graphite px-3 py-3 text-sm font-medium text-white"
        >
          Обади се
        </a>
        {onPlatform ? (
          <button
            type="button"
            className="inline-flex items-center justify-center border border-accent bg-accent px-3 py-3 text-sm font-medium text-graphite"
            onClick={() =>
              window.dispatchEvent(new Event("stz:open-booking"))
            }
          >
            Резервирай
          </button>
        ) : (
          <a
            href="/#platformi"
            className="inline-flex items-center justify-center border border-accent bg-accent px-3 py-3 text-sm font-medium text-graphite"
          >
            Резервирай
          </a>
        )}
      </div>
    </div>
  );
}
