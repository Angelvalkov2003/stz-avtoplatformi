"use client";

import { openCookieSettings } from "@/components/cookies/CookieBanner";

export function CookieSettingsLink() {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="block text-left hover:text-accent"
    >
      Бисквитки
    </button>
  );
}
