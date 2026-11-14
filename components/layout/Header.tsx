"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

const links = [
  { href: "/#platformi", label: "Платформи" },
  { href: "/#kak-raboti", label: "Как работи" },
  { href: "/#chzv", label: "ЧЗВ" },
  { href: "/#kontakti", label: "Контакти" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-silver/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="relative block h-10 w-[9.5rem] shrink-0 md:h-11 md:w-44">
          <Image
            src="/images/logo.png"
            alt={siteConfig.name}
            fill
            className="object-contain object-left"
            sizes="176px"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Основна">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-steel transition-colors hover:text-graphite"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={siteConfig.phoneHref}
            className="tabular text-sm font-medium text-graphite"
          >
            {siteConfig.phone}
          </a>
        </nav>

        <button
          type="button"
          className="border border-silver px-3 py-2 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          Меню
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-silver px-4 py-3 md:hidden"
          aria-label="Мобилно меню"
        >
          <ul className="flex flex-col gap-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block text-sm text-graphite"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={siteConfig.phoneHref} className="tabular text-sm font-medium">
                {siteConfig.phone}
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
