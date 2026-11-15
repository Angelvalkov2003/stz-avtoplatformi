"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";

const links = [
  { href: "/#platformi", label: "Платформи" },
  { href: "/#kak-raboti", label: "Как работи" },
  { href: "/#chzv", label: "ЧЗВ" },
  { href: "/#kontakti", label: "Контакти" },
];

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <path d="M14 8.2h2.1V5H14c-2.4 0-4 1.5-4 4.1V11H7.5v3.2H10V19h3.2v-4.8h2.4l.5-3.2h-2.9V9.2c0-.6.3-1 1.1-1z" />
    </svg>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.6 4.8c.4-.4 1-.5 1.5-.3l2.2.9c.5.2.8.7.7 1.3l-.4 2.1a1.2 1.2 0 0 1-.7.9l-1.1.4a11.4 11.4 0 0 0 5.4 5.4l.4-1.1c.2-.4.5-.6.9-.7l2.1-.4c.5-.1 1.1.2 1.3.7l.9 2.2c.2.5.1 1.1-.3 1.5l-1.2 1.2c-.4.4-1 .6-1.6.5C9.7 18.7 5.3 14.3 4.1 8.4c-.1-.6.1-1.2.5-1.6L6.6 4.8z"
      />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-silver/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="relative block h-10 w-[9.5rem] shrink-0 md:h-11 md:w-44"
        >
          <Image
            src="/images/logo.png"
            alt={siteConfig.name}
            fill
            className="object-contain object-left"
            sizes="176px"
          />
        </Link>

        <nav
          className="hidden items-center gap-5 md:flex"
          aria-label="Основна"
        >
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
            className="tabular inline-flex items-center gap-1.5 text-sm font-medium text-graphite"
          >
            <PhoneIcon className="h-4 w-4" />
            {siteConfig.phone}
          </a>
          <a
            href={siteConfig.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="inline-flex h-9 w-9 items-center justify-center border border-silver text-graphite transition-colors hover:border-graphite"
          >
            <FacebookIcon className="h-4 w-4" />
          </a>
        </nav>

        <div className="flex items-center gap-1.5 md:hidden">
          <a
            href={siteConfig.phoneHref}
            aria-label={`Обади се на ${siteConfig.phone}`}
            className="inline-flex h-10 w-10 items-center justify-center text-graphite"
          >
            <PhoneIcon className="h-5 w-5" />
          </a>
          <a
            href={siteConfig.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="inline-flex h-10 w-10 items-center justify-center text-graphite"
          >
            <FacebookIcon className="h-5 w-5" />
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? "Затвори меню" : "Отвори меню"}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`block h-px w-5 bg-graphite transition-transform duration-300 ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-5 bg-graphite transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-px w-5 bg-graphite transition-transform duration-300 ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-graphite/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      {/* Drawer — 2/3 width, from right */}
      <aside
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Мобилно меню"
        className={`fixed inset-y-0 right-0 z-[70] flex w-2/3 max-w-sm flex-col border-l border-silver bg-white shadow-none transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-silver px-4 py-3">
          <p className="font-display text-sm font-semibold text-graphite">
            Меню
          </p>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center text-steel"
            aria-label="Затвори"
            onClick={() => setOpen(false)}
          >
            <span className="relative block h-4 w-4">
              <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 rotate-45 bg-graphite" />
              <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 -rotate-45 bg-graphite" />
            </span>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-2 py-4" aria-label="Мобилно">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 px-3 py-3 text-base text-graphite transition-colors hover:bg-warm"
              onClick={() => setOpen(false)}
            >
              <span className="tabular text-xs text-steel">
                {String(i + 1).padStart(2, "0")}
              </span>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-3 border-t border-silver p-4">
          <a
            href={siteConfig.phoneHref}
            className="tabular flex items-center gap-2 text-sm font-medium text-graphite"
            onClick={() => setOpen(false)}
          >
            <PhoneIcon className="h-4 w-4" />
            {siteConfig.phone}
          </a>
          <a
            href={siteConfig.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-steel"
            onClick={() => setOpen(false)}
          >
            <FacebookIcon className="h-4 w-4" />
            Facebook
          </a>
          <div className="hazard h-1.5 w-full" aria-hidden />
        </div>
      </aside>
    </header>
  );
}
