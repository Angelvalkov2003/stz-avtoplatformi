"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { createPortal } from "react-dom";
import { DayPicker, type DateRange } from "react-day-picker";
import { bg } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { submitBooking, type BookingActionState } from "@/app/actions/booking";
import { Button } from "@/components/ui/Button";
import {
  formatISODate,
  rangesToBusySet,
  sofiaToday,
} from "@/lib/dates-client";
import { countInclusiveDays, estimatePrice, formatEur } from "@/lib/pricing";
import { siteConfig } from "@/lib/site-config";
import type { PlatformPrice } from "@/lib/types";

type BusyRange = { start_date: string; end_date: string; status: string };
type TravelScope = "bulgaria" | "abroad";

type Props = {
  platformId: string;
  platformName: string;
  prices: PlatformPrice[];
  initialBusy: BusyRange[];
  open: boolean;
  onClose: () => void;
};

const initial: BookingActionState = { ok: false };

const fieldClass =
  "w-full border border-silver bg-white px-3.5 py-3 text-sm text-graphite outline-none transition-colors placeholder:text-silver focus:border-graphite";

const PICKUP_HOURS = Array.from({ length: 11 }, (_, i) => {
  const h = String(i + 8).padStart(2, "0");
  return `${h}:00`;
});

function formatBgShort(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function formatBgDayMonth(iso: string) {
  const [, m, d] = iso.split("-");
  return `${d}.${m}`;
}

export function BookingModal({
  platformId,
  platformName,
  prices,
  initialBusy,
  open,
  onClose,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [state, formAction, pending] = useActionState(submitBooking, initial);
  const [range, setRange] = useState<DateRange | undefined>();
  const [busy, setBusy] = useState(initialBusy);
  const [pickupTime, setPickupTime] = useState("09:00");
  const [travelScope, setTravelScope] = useState<TravelScope | "">("");
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setStep(1);
      setRange(undefined);
      setPickupTime("09:00");
      setTravelScope("");
    }
  }, [open]);

  useEffect(() => {
    if (state.message?.includes("току-що бяха заети")) {
      startTransition(async () => {
        const res = await fetch(`/api/availability?platformId=${platformId}`, {
          cache: "no-store",
        });
        if (res.ok) {
          setBusy((await res.json()) as BusyRange[]);
          setRange(undefined);
          setStep(1);
        }
      });
    }
  }, [state.message, platformId]);

  const busySet = useMemo(() => rangesToBusySet(busy), [busy]);
  const todayIso = sofiaToday();
  const startIso = range?.from ? formatISODate(range.from) : "";
  const endIso = range?.to
    ? formatISODate(range.to)
    : range?.from
      ? formatISODate(range.from)
      : "";

  const price = useMemo(() => {
    if (!range?.from) return null;
    const end = range.to ?? range.from;
    const days = countInclusiveDays(range.from, end);
    return { days, ...estimatePrice(days, prices) };
  }, [range, prices]);

  function isDisabled(date: Date) {
    const iso = formatISODate(date);
    return iso < todayIso || busySet.has(iso);
  }

  const canContinue = Boolean(startIso && endIso && price && pickupTime);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending || !startIso || !endIso || !travelScope) return;
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const fd = new FormData(form);
    fd.set("platformId", platformId);
    fd.set("startDate", startIso);
    fd.set("endDate", endIso);
    fd.set("pickupTime", pickupTime);
    fd.set("travelScope", travelScope);
    fd.set("website", "");
    startTransition(() => {
      formAction(fd);
    });
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[200] md:p-6 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Затвори"
        className={`absolute inset-0 border-0 bg-graphite/55 backdrop-blur-[6px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Резервация"
        className={`relative mx-auto flex h-full max-h-none w-full max-w-lg flex-col bg-white transition-transform duration-300 ease-out md:mt-[4vh] md:h-auto md:max-h-[92vh] ${
          open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-silver bg-graphite px-4 py-4 text-white">
          <div>
            <p className="tabular text-[11px] text-silver">
              Стъпка {step} от 2
            </p>
            <h2 className="font-display text-lg font-semibold">Резервация</h2>
            <p className="mt-0.5 text-xs text-silver">{platformName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center text-silver hover:text-white"
            aria-label="Затвори"
          >
            <span className="relative block h-4 w-4">
              <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <div className="h-1 w-full bg-silver/40">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>

        {step === 1 ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
              <p className="text-sm text-steel">
                Изберете период. Заетите дни са изключени.
              </p>
              <div className="mt-4 border border-silver bg-warm/40 p-2 sm:p-3">
                <DayPicker
                  mode="range"
                  locale={bg}
                  selected={range}
                  onSelect={setRange}
                  disabled={isDisabled}
                  numberOfMonths={1}
                  aria-label="Календар за избор на период"
                  className="rdp-stz mx-auto"
                />
              </div>

              <div className="mt-4 border border-silver bg-white p-4">
                {price && startIso ? (
                  <div className="space-y-3">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-steel">Период</p>
                        <p className="tabular mt-1 text-sm font-medium">
                          {formatBgShort(startIso)}
                          {endIso !== startIso
                            ? ` – ${formatBgShort(endIso)}`
                            : ""}
                        </p>
                        <p className="tabular mt-1 text-xs text-steel">
                          {price.days} {price.days === 1 ? "ден" : "дни"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-steel">
                          * {siteConfig.paymentNote}
                        </p>
                        <p className="mt-1 text-xs font-medium text-steel">
                          Общо за периода
                        </p>
                        <p className="tabular font-display text-2xl font-semibold">
                          {price.kind === "negotiable"
                            ? "По дог."
                            : formatEur(price.totalEur ?? 0)}
                        </p>
                      </div>
                    </div>

                    <label className="block border-t border-silver pt-3">
                      <span className="mb-1.5 block text-xs font-medium text-steel">
                        Час на вземане *
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="tabular text-sm font-medium">
                          {formatBgDayMonth(startIso)} в
                        </span>
                        <select
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className={`tabular max-w-[7.5rem] ${fieldClass}`}
                          aria-label="Час на вземане"
                        >
                          {PICKUP_HOURS.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-steel">
                        * {siteConfig.pickupHoursNote}
                      </p>
                    </label>
                  </div>
                ) : (
                  <p className="text-sm text-steel">
                    Маркирайте начална и крайна дата.
                  </p>
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-2 border-t border-silver bg-white p-4">
              <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
                Отказ
              </Button>
              <Button
                type="button"
                className="flex-[1.4]"
                disabled={!canContinue}
                onClick={() => setStep(2)}
              >
                Напред
              </Button>
            </div>
          </>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 space-y-3.5 overflow-y-auto p-4 md:p-5">
              <input type="hidden" name="platformId" value={platformId} />
              <input type="hidden" name="startDate" value={startIso} />
              <input type="hidden" name="endDate" value={endIso} />
              <input type="hidden" name="pickupTime" value={pickupTime} />
              <input type="hidden" name="travelScope" value={travelScope} />
              <input
                type="text"
                name="website"
                value=""
                readOnly
                tabIndex={-1}
                autoComplete="off"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                aria-hidden
              />

              <div className="border border-silver bg-warm px-3.5 py-3 text-sm">
                <p className="tabular font-medium">
                  {formatBgShort(startIso)} – {formatBgShort(endIso)}
                  <span className="mx-2 text-silver">·</span>
                  {formatBgDayMonth(startIso)} в {pickupTime}
                </p>
                <p className="mt-1 text-xs text-steel">
                  * {siteConfig.paymentNote}
                </p>
                <p className="tabular mt-1 font-medium">
                  {price?.kind === "negotiable"
                    ? "По договаряне"
                    : `Общо за периода: ${formatEur(price?.totalEur ?? 0)}`}
                </p>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-steel">
                  Име *
                </span>
                <input
                  name="customerName"
                  required
                  autoComplete="name"
                  className={fieldClass}
                />
              </label>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-steel">
                    Телефон *
                  </span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="0888123456"
                    className={`tabular ${fieldClass}`}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-steel">
                    Имейл *
                  </span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={fieldClass}
                  />
                </label>
              </div>

              <fieldset>
                <legend className="mb-2 text-xs font-medium text-steel">
                  Къде ще пътувате *
                </legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label
                    className={`flex cursor-pointer items-center gap-2 border px-3 py-3 text-sm ${
                      travelScope === "bulgaria"
                        ? "border-graphite bg-warm"
                        : "border-silver bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="travelScopeRadio"
                      checked={travelScope === "bulgaria"}
                      onChange={() => setTravelScope("bulgaria")}
                      required
                      className="accent-graphite"
                    />
                    <span>България</span>
                  </label>
                  <label
                    className={`flex cursor-pointer items-center gap-2 border px-3 py-3 text-sm ${
                      travelScope === "abroad"
                        ? "border-graphite bg-warm"
                        : "border-silver bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="travelScopeRadio"
                      checked={travelScope === "abroad"}
                      onChange={() => setTravelScope("abroad")}
                      className="accent-graphite"
                    />
                    <span>Чужбина</span>
                  </label>
                </div>
                {travelScope === "abroad" ? (
                  <p className="mt-3 border border-silver bg-warm px-3 py-3 text-xs leading-relaxed text-graphite">
                    {siteConfig.abroadTravelNote}
                  </p>
                ) : null}
              </fieldset>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-steel">
                  Бележка
                </span>
                <textarea
                  name="note"
                  rows={3}
                  placeholder="Допълнителни уточнения…"
                  className={`${fieldClass} min-h-[5rem] resize-y`}
                />
                <span className="mt-1.5 block text-xs leading-relaxed text-steel">
                  * {siteConfig.pickupHoursNote}
                </span>
              </label>

              <label className="flex items-start gap-3 border border-silver bg-warm/50 px-3.5 py-3 text-sm">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  value="on"
                  required
                  className="mt-0.5 accent-graphite"
                />
                <span>
                  Съгласен съм с{" "}
                  <a href="/usloviya" className="underline">
                    условията
                  </a>
                  .
                </span>
              </label>

              {state.message ? (
                <p
                  className="border border-silver bg-warm px-3 py-2 text-sm"
                  role="alert"
                >
                  {state.message}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 gap-2 border-t border-silver bg-white p-4">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                Назад
              </Button>
              <Button
                type="submit"
                className="flex-[1.4]"
                disabled={pending || !startIso || !endIso || !travelScope}
              >
                {pending ? "Изпращане…" : "Изпрати заявка"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
