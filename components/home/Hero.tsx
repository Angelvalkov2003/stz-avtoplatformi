"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

const HEADLINE = "Автомобилни платформи под наем";
const TAGLINE = "Бърза резервация онлайн или по телефона";

type Phase = "typing" | "brand" | "tagline" | "cta" | "done";

export function Hero() {
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState("");
  const [reduced, setReduced] = useState(false);
  const typedRef = useRef("");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setReduced(true);
      typedRef.current = HEADLINE;
      setTyped(HEADLINE);
      setPhase("done");
      return;
    }

    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      const next = HEADLINE.slice(0, i);
      typedRef.current = next;
      setTyped(next);
      if (i >= HEADLINE.length) {
        window.clearInterval(timer);
        setPhase("brand");
      }
    }, 42);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (reduced || phase === "typing" || phase === "done") return;

    const delays: Partial<Record<Phase, number>> = {
      brand: 720,
      tagline: 780,
      cta: 700,
    };
    const next: Partial<Record<Phase, Phase>> = {
      brand: "tagline",
      tagline: "cta",
      cta: "done",
    };

    const delay = delays[phase];
    const following = next[phase];
    if (delay == null || !following) return;

    const timer = window.setTimeout(() => setPhase(following), delay);
    return () => window.clearTimeout(timer);
  }, [phase, reduced]);

  const showBrand = phase !== "typing";
  const showTagline = phase === "tagline" || phase === "cta" || phase === "done";
  const showCta = phase === "cta" || phase === "done";
  const showCaret = phase === "typing";

  return (
    <section className="relative isolate min-h-[78vh] overflow-hidden bg-graphite text-white">
      <Image
        src="/images/main.jpg"
        alt="Автомобилна платформа на СТЗ"
        fill
        priority
        className="object-cover object-center opacity-60"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/80 to-graphite/35" />
      <div className="absolute inset-x-0 bottom-0 h-3 hazard opacity-90" aria-hidden />

      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 md:px-6 md:pb-20">
        <p
          className={`font-display text-sm tracking-[0.18em] text-accent md:text-base ${
            showBrand ? (reduced ? "opacity-100" : "hero-drop") : "invisible"
          }`}
        >
          {siteConfig.name}
        </p>

        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold uppercase leading-[1.05] md:text-6xl">
          <span className="sr-only">{HEADLINE}</span>
          <span aria-hidden className="block min-h-[1.15em]">
            <span>{typed || "\u00A0"}</span>
            <span
              className={`hero-caret ml-0.5 inline-block translate-y-[-0.05em] align-baseline ${
                showCaret ? "opacity-100" : "opacity-0"
              }`}
            />
          </span>
        </h1>

        <div className="mt-4 min-h-[1.6em] max-w-xl overflow-hidden">
          <p
            className={`text-base leading-relaxed text-silver md:text-lg ${
              showTagline ? (reduced ? "opacity-100" : "hero-ltr") : "invisible"
            }`}
          >
            {TAGLINE}
          </p>
        </div>

        <div
          className={`mt-8 flex flex-wrap gap-3 ${
            showCta ? (reduced ? "opacity-100" : "hero-rise") : "invisible"
          }`}
        >
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
