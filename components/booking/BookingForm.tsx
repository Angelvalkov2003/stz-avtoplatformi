"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import {
  DayPicker,
  type DateRange,
} from "react-day-picker";
import { bg } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { submitBooking, type BookingActionState } from "@/app/actions/booking";
import { Button } from "@/components/ui/Button";
import { countInclusiveDays, estimatePrice, formatEur } from "@/lib/pricing";
import { formatISODate, rangesToBusySet, sofiaToday } from "@/lib/dates-client";
import type { PlatformPrice } from "@/lib/types";
import { siteConfig } from "@/lib/site-config";

type BusyRange = { start_date: string; end_date: string; status: string };

type Props = {
  platformId: string;
  prices: PlatformPrice[];
  initialBusy: BusyRange[];
};

const initial: BookingActionState = { ok: false };

export function BookingForm({ platformId, prices, initialBusy }: Props) {
  const [state, action, pending] = useActionState(submitBooking, initial);
  const [range, setRange] = useState<DateRange | undefined>();
  const [busy, setBusy] = useState(initialBusy);
  const [, startTransition] = useTransition();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (state.message?.includes("току-що бяха заети")) {
      startTransition(async () => {
        const res = await fetch(`/api/availability?platformId=${platformId}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = (await res.json()) as BusyRange[];
          setBusy(data);
          setRange(undefined);
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
    if (iso < todayIso) return true;
    return busySet.has(iso);
  }

  return (
    <div className="border border-silver bg-white">
      <div className="border-b border-silver bg-warm px-4 py-3 md:px-5">
        <h3 className="font-display text-lg font-semibold">Резервация</h3>
        <p className="mt-1 text-sm text-steel">{siteConfig.paymentNote}</p>
      </div>

      <div className="grid gap-6 p-4 md:grid-cols-2 md:p-5">
        <div>
          <DayPicker
            mode="range"
            locale={bg}
            selected={range}
            onSelect={setRange}
            disabled={isDisabled}
            numberOfMonths={1}
            aria-label="Календар за избор на период"
            className="rdp-stz"
          />
          {price ? (
            <p className="mt-3 text-sm">
              <span className="text-steel">Период: </span>
              <span className="tabular font-medium">{price.days} дни</span>
              <span className="mx-2 text-silver">|</span>
              <span className="tabular font-medium">
                {price.kind === "negotiable"
                  ? price.label
                  : formatEur(price.totalEur ?? 0)}
              </span>
              <span className="mt-1 block text-xs text-steel">
                ориентировъчна цена
              </span>
            </p>
          ) : (
            <p className="mt-3 text-sm text-steel">Изберете начална и крайна дата.</p>
          )}
        </div>

        <form
          action={async (fd) => {
            if (submitting || pending) return;
            setSubmitting(true);
            try {
              await action(fd);
            } finally {
              setSubmitting(false);
            }
          }}
          className="flex flex-col gap-3"
        >
          <input type="hidden" name="platformId" value={platformId} />
          <input type="hidden" name="startDate" value={startIso} />
          <input type="hidden" name="endDate" value={endIso} />
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            aria-hidden
          />

          <label className="block text-sm">
            <span className="mb-1 block text-steel">Име *</span>
            <input
              name="customerName"
              required
              className="w-full border border-silver bg-white px-3 py-2.5 outline-none focus:border-graphite"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-steel">Телефон *</span>
            <input
              name="phone"
              type="tel"
              required
              placeholder="08xxxxxxxx"
              className="tabular w-full border border-silver bg-white px-3 py-2.5 outline-none focus:border-graphite"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-steel">Имейл *</span>
            <input
              name="email"
              type="email"
              required
              className="w-full border border-silver bg-white px-3 py-2.5 outline-none focus:border-graphite"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-steel">Какво ще превозвате</span>
            <input
              name="cargo"
              className="w-full border border-silver bg-white px-3 py-2.5 outline-none focus:border-graphite"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-steel">Бележка</span>
            <textarea
              name="note"
              rows={3}
              className="w-full border border-silver bg-white px-3 py-2.5 outline-none focus:border-graphite"
            />
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="acceptTerms"
              required
              className="mt-1"
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
            <p className="border border-silver bg-warm px-3 py-2 text-sm" role="alert">
              {state.message}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={pending || submitting || !startIso || !endIso}
            className="w-full"
          >
            {pending || submitting ? "Изпращане…" : "Изпрати заявка"}
          </Button>
        </form>
      </div>
    </div>
  );
}
