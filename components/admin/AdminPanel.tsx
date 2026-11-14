"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import {
  createManualBookingAction,
  deleteBookingAction,
  logoutAction,
  setBookingStatusAction,
  type AdminState,
} from "@/app/actions/admin";
import { Button } from "@/components/ui/Button";
import { formatBgDate } from "@/lib/dates";
import { formatEur } from "@/lib/pricing";
import type { BookingStatus, BookingWithPlatform, Platform } from "@/lib/types";

type Props = {
  platforms: Platform[];
  bookings: BookingWithPlatform[];
  upcoming: BookingWithPlatform[];
};

const statusStyle: Record<BookingStatus, string> = {
  pending: "bg-accent text-graphite",
  confirmed: "bg-graphite text-white",
  blocked:
    "bg-[repeating-linear-gradient(-45deg,#C8CCD2,#C8CCD2_6px,#fff_6px,#fff_12px)] text-graphite",
  completed: "bg-steel text-white",
  cancelled: "bg-warm text-steel line-through",
};

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function AdminPanel({ platforms, bookings, upcoming }: Props) {
  const [platformId, setPlatformId] = useState(platforms[0]?.id ?? "");
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [selected, setSelected] = useState<BookingWithPlatform | null>(null);
  const [showCancelled, setShowCancelled] = useState(false);
  const [manualState, manualAction, manualPending] = useActionState(
    createManualBookingAction,
    { ok: false } as AdminState,
  );
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b.platform_id === platformId &&
          (showCancelled || b.status !== "cancelled"),
      ),
    [bookings, platformId, showCancelled],
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const dim = daysInMonth(year, month);
  const startWeekday = (new Date(year, month, 1).getDay() + 6) % 7;

  function bookingsOnDay(day: number) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return filtered.filter((b) => b.start_date <= iso && b.end_date >= iso);
  }

  function runStatus(id: string, status: BookingStatus) {
    startTransition(async () => {
      await setBookingStatusAction(id, status);
      window.location.reload();
    });
  }

  function runDelete(id: string) {
    if (!confirm("Изтриване на резервацията?")) return;
    startTransition(async () => {
      await deleteBookingAction(id);
      window.location.reload();
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Админ панел</h1>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost">
            Изход
          </Button>
        </form>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {platforms.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPlatformId(p.id)}
            className={`border px-3 py-2 text-sm ${
              platformId === p.id
                ? "border-accent bg-accent text-graphite"
                : "border-silver bg-white"
            }`}
          >
            {p.short_name}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
          >
            ←
          </Button>
          <p className="tabular min-w-[9rem] text-center font-medium">
            {cursor.toLocaleDateString("bg-BG", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
          >
            →
          </Button>
        </div>
        <label className="flex items-center gap-2 text-sm text-steel">
          <input
            type="checkbox"
            checked={showCancelled}
            onChange={(e) => setShowCancelled(e.target.checked)}
          />
          Покажи отказани
        </label>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-steel">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
        {Array.from({ length: startWeekday }).map((_, i) => (
          <div key={`e-${i}`} />
        ))}
        {Array.from({ length: dim }).map((_, i) => {
          const day = i + 1;
          const list = bookingsOnDay(day);
          return (
            <div
              key={`${monthKey(cursor)}-${day}`}
              className="min-h-20 border border-silver bg-white p-1 text-left"
            >
              <p className="tabular px-1 text-[11px] text-steel">{day}</p>
              <div className="mt-1 space-y-0.5">
                {list.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelected(b)}
                    className={`block w-full truncate px-1 py-0.5 text-[10px] ${statusStyle[b.status]}`}
                  >
                    {b.status === "blocked" ? "Блок" : b.customer_name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-lg font-semibold">Предстоящи</h2>
          <ul className="mt-3 divide-y divide-silver border border-silver">
            {upcoming.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  className="flex w-full flex-col gap-1 px-4 py-3 text-left text-sm hover:bg-warm"
                  onClick={() => {
                    setPlatformId(b.platform_id);
                    setSelected(b);
                  }}
                >
                  <span className="font-medium">
                    {b.platform?.short_name} — {b.customer_name}
                  </span>
                  <span className="tabular text-steel">
                    {formatBgDate(b.start_date)} – {formatBgDate(b.end_date)}
                  </span>
                  <span
                    className={`inline-flex w-fit px-1.5 py-0.5 text-xs ${statusStyle[b.status]}`}
                  >
                    {b.status}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold">Добави ръчно</h2>
          <form
            action={async (fd) => {
              await manualAction(fd);
              if (!manualPending) window.location.reload();
            }}
            className="mt-3 space-y-3 border border-silver p-4"
          >
            <input type="hidden" name="platformId" value={platformId} />
            <label className="block text-sm">
              От
              <input
                type="date"
                name="startDate"
                required
                className="mt-1 w-full border border-silver px-2 py-2"
              />
            </label>
            <label className="block text-sm">
              До
              <input
                type="date"
                name="endDate"
                required
                className="mt-1 w-full border border-silver px-2 py-2"
              />
            </label>
            <label className="block text-sm">
              Статус
              <select
                name="status"
                className="mt-1 w-full border border-silver px-2 py-2"
                defaultValue="confirmed"
              >
                <option value="confirmed">Потвърдена</option>
                <option value="pending">Чакаща</option>
                <option value="blocked">Блокирани дни</option>
              </select>
            </label>
            <label className="block text-sm">
              Име
              <input name="customerName" className="mt-1 w-full border border-silver px-2 py-2" />
            </label>
            <label className="block text-sm">
              Телефон
              <input name="phone" className="mt-1 w-full border border-silver px-2 py-2" />
            </label>
            <label className="block text-sm">
              Имейл
              <input name="email" type="email" className="mt-1 w-full border border-silver px-2 py-2" />
            </label>
            <label className="block text-sm">
              Бележка
              <textarea name="note" rows={2} className="mt-1 w-full border border-silver px-2 py-2" />
            </label>
            {manualState.message ? (
              <p className="text-sm text-steel">{manualState.message}</p>
            ) : null}
            <Button type="submit" disabled={manualPending} className="w-full">
              Запиши
            </Button>
          </form>
        </div>
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-graphite/50 p-4 md:items-center"
          role="dialog"
          aria-modal
          aria-label="Детайли за резервация"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-silver bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-lg font-semibold">
                {selected.customer_name}
              </h3>
              <button type="button" onClick={() => setSelected(null)} className="text-sm">
                Затвори
              </button>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-steel">Телефон</dt>
                <dd>
                  <a href={`tel:${selected.phone}`} className="tabular underline">
                    {selected.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-steel">Имейл</dt>
                <dd>{selected.email}</dd>
              </div>
              <div>
                <dt className="text-steel">Период</dt>
                <dd className="tabular">
                  {formatBgDate(selected.start_date)} –{" "}
                  {formatBgDate(selected.end_date)}
                </dd>
              </div>
              <div>
                <dt className="text-steel">Цена</dt>
                <dd className="tabular">
                  {selected.estimated_total_eur != null
                    ? formatEur(selected.estimated_total_eur)
                    : "По договаряне"}
                </dd>
              </div>
              <div>
                <dt className="text-steel">Бележка</dt>
                <dd>{selected.note || "—"}</dd>
              </div>
              <div>
                <dt className="text-steel">Статус</dt>
                <dd>{selected.status}</dd>
              </div>
            </dl>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button
                type="button"
                disabled={pending}
                onClick={() => runStatus(selected.id, "confirmed")}
              >
                Потвърди
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={pending}
                onClick={() => runStatus(selected.id, "cancelled")}
              >
                Откажи
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={pending}
                onClick={() => runStatus(selected.id, "completed")}
              >
                Завършена
              </Button>
              <Button
                type="button"
                variant="danger"
                disabled={pending}
                onClick={() => runDelete(selected.id)}
              >
                Изтрий
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
