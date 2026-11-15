"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
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

type Props = {
  platformId: string;
  prices: PlatformPrice[];
  initialBusy: BusyRange[];
};

const initial: BookingActionState = { ok: false };

const fieldClass =
  "w-full border border-silver bg-white px-3.5 py-3 text-sm text-graphite outline-none transition-colors placeholder:text-silver focus:border-graphite focus:bg-warm/40";

function formatBgShort(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

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

  const busySubmitting = pending || submitting;

  return (
    <section className="overflow-hidden border border-silver bg-white">
      <div className="relative border-b border-silver bg-graphite px-5 py-5 text-white">
        <div className="absolute inset-x-0 top-0 h-1 bg-accent" aria-hidden />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="tabular text-xs tracking-wide text-silver">01</p>
            <h3 className="font-display text-xl font-semibold">Резервация</h3>
          </div>
          <p className="max-w-[16rem] text-right text-xs leading-relaxed text-silver">
            {siteConfig.paymentNote}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.05fr]">
        <div className="border-b border-silver bg-warm/60 p-4 lg:border-b-0 lg:border-r lg:p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-steel">
            Избери период
          </p>
          <div className="border border-silver bg-white p-2 sm:p-3">
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

          <div className="mt-4 border border-silver bg-white">
            {price && startIso ? (
              <div className="grid grid-cols-[1fr_auto] gap-3 p-4">
                <div>
                  <p className="text-xs text-steel">Избран период</p>
                  <p className="tabular mt-1 text-sm font-medium text-graphite">
                    {formatBgShort(startIso)}
                    {endIso && endIso !== startIso
                      ? ` – ${formatBgShort(endIso)}`
                      : ""}
                  </p>
                  <p className="tabular mt-1 text-xs text-steel">
                    {price.days} {price.days === 1 ? "ден" : "дни"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-steel">ориентировъчна цена</p>
                  <p className="tabular mt-1 font-display text-2xl font-semibold text-graphite">
                    {price.kind === "negotiable"
                      ? "По дог."
                      : formatEur(price.totalEur ?? 0)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="px-4 py-5 text-sm text-steel">
                Маркирайте начална и крайна дата в календара. Заетите дни са
                изключени.
              </p>
            )}
            <div className="flex items-center gap-3 border-t border-silver bg-accent/25 px-4 py-2.5">
              <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden />
              <p className="text-xs text-graphite">
                Плащане само в брой при вземане
              </p>
            </div>
          </div>
        </div>

        <form
          action={async (fd) => {
            if (busySubmitting) return;
            setSubmitting(true);
            try {
              await action(fd);
            } finally {
              setSubmitting(false);
            }
          }}
          className="flex flex-col gap-4 p-4 lg:p-5"
        >
          <div>
            <p className="tabular text-xs tracking-wide text-steel">02</p>
            <p className="font-display text-base font-semibold text-graphite">
              Вашите данни
            </p>
          </div>

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

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-steel">
              Име <span className="text-graphite">*</span>
            </span>
            <input
              name="customerName"
              required
              autoComplete="name"
              className={fieldClass}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-steel">
                Телефон <span className="text-graphite">*</span>
              </span>
              <input
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="08xxxxxxxx"
                className={`tabular ${fieldClass}`}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-steel">
                Имейл <span className="text-graphite">*</span>
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

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-steel">
              Какво ще превозвате
            </span>
            <input
              name="cargo"
              placeholder="напр. лек автомобил, материали…"
              className={fieldClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-steel">
              Бележка
            </span>
            <textarea
              name="note"
              rows={3}
              placeholder="Час, място или друга уточнение"
              className={`${fieldClass} resize-y min-h-[5.5rem]`}
            />
          </label>

          <label className="flex cursor-pointer items-start gap-3 border border-silver bg-warm/50 px-3.5 py-3 text-sm">
            <input
              type="checkbox"
              name="acceptTerms"
              required
              className="mt-0.5 h-4 w-4 accent-graphite"
            />
            <span className="leading-snug text-graphite">
              Съгласен съм с{" "}
              <a href="/usloviya" className="underline underline-offset-2">
                условията за наем
              </a>
              .
            </span>
          </label>

          {state.message ? (
            <p
              className="border border-silver bg-warm px-3.5 py-3 text-sm text-graphite"
              role="alert"
            >
              {state.message}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={busySubmitting || !startIso || !endIso}
            className="mt-1 w-full py-3.5 text-base"
          >
            {busySubmitting ? "Изпращане…" : "Изпрати заявка"}
          </Button>

          <p className="text-center text-xs text-steel">
            Ще се обадим за потвърждение. Без онлайн плащане.
          </p>
        </form>
      </div>
    </section>
  );
}
