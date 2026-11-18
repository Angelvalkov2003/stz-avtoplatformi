"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  applyGtagConsent,
  readConsent,
  writeConsent,
  type ConsentValue,
} from "@/lib/cookie-consent";

const OPEN_EVENT = "stz:open-cookies";

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      applyGtagConsent(existing);
      return;
    }
    setVisible(true);
  }, []);

  useEffect(() => {
    const onOpen = () => setVisible(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  function choose(value: ConsentValue) {
    writeConsent(value);
    applyGtagConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-silver bg-white p-4 shadow-[0_-8px_24px_rgba(30,33,37,0.12)] md:bottom-4 md:left-4 md:right-auto md:max-w-md md:border md:p-5"
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
    >
      <p
        id="cookie-banner-title"
        className="font-display text-sm font-semibold text-graphite"
      >
        Бисквитки
      </p>
      <p
        id="cookie-banner-desc"
        className="mt-2 text-sm leading-relaxed text-steel"
      >
        Използваме бисквитки за статистика (Google Analytics), след като бъдат
        включени. Можете да приемете или да откажете. Вижте и{" "}
        <Link href="/usloviya" className="underline underline-offset-2 hover:text-graphite">
          общите условия
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => choose("denied")}
          className="inline-flex flex-1 items-center justify-center border border-silver px-3 py-2.5 text-sm font-medium text-graphite hover:border-graphite sm:flex-none"
        >
          Отказвам
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className="inline-flex flex-1 items-center justify-center border border-accent bg-accent px-3 py-2.5 text-sm font-medium text-graphite hover:brightness-95 sm:flex-none"
        >
          Приемам
        </button>
      </div>
    </div>
  );
}
