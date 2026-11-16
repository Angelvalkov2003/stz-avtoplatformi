"use client";

import { useCallback, useEffect, useState } from "react";
import { BookingModal } from "@/components/booking/BookingModal";
import { Gallery } from "@/components/platform/Gallery";
import { PriceTable } from "@/components/platform/PriceTable";
import { Button } from "@/components/ui/Button";
import {
  axleCount,
  dimensionsLabel,
  licenseNote,
  sharedEquipment,
  socketLabel,
} from "@/lib/platform-specs";
import { formatEur } from "@/lib/pricing";
import { siteConfig } from "@/lib/site-config";
import type { PlatformWithPrices } from "@/lib/types";

type BusyRange = { start_date: string; end_date: string; status: string };

type Props = {
  platform: PlatformWithPrices;
  images: string[];
  busy: BusyRange[];
};

export function PlatformView({ platform, images, busy }: Props) {
  const [open, setOpen] = useState(false);
  const from = platform.prices.find((x) => x.days === 1)?.total_eur;

  const openBooking = useCallback(() => setOpen(true), []);
  const closeBooking = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === "#rezervaciya") openBooking();
    };
    const onCustom = () => openBooking();
    onHash();
    window.addEventListener("hashchange", onHash);
    window.addEventListener("stz:open-booking", onCustom);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("stz:open-booking", onCustom);
    };
  }, [openBooking]);

  const specs: [string, string][] = [
    ["Размери", dimensionsLabel(platform)],
    ["Товароносимост", `${platform.capacity_kg} кг`],
    [
      "Собствена маса",
      platform.curb_weight_kg != null ? `~${platform.curb_weight_kg} кг` : "—",
    ],
    [
      "Допустим товар",
      platform.payload_kg != null ? `~${platform.payload_kg} кг` : "—",
    ],
    ["Брой оси", String(axleCount(platform))],
    ["Букса", socketLabel(platform)],
  ];

  return (
    <>
      <section className="border-b border-silver bg-graphite text-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[1fr_auto] md:items-end md:px-6 md:py-10">
          <div>
            <p className="tabular text-xs text-silver">
              {String(platform.sort_order).padStart(2, "0")} / платформа
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
              {platform.name}
            </h1>
            {platform.highlight ? (
              <p className="mt-3 inline-block bg-accent px-2.5 py-1 text-xs font-medium text-graphite">
                {platform.highlight}
              </p>
            ) : null}
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-silver">
              {platform.description}
            </p>
            <p className="mt-4 max-w-xl border border-accent/40 bg-accent px-3 py-2 text-sm font-medium text-graphite">
              {licenseNote}
            </p>
            <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div>
                <dt className="text-xs text-silver">Размери</dt>
                <dd className="tabular font-medium">
                  {dimensionsLabel(platform)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-silver">Товароносимост</dt>
                <dd className="tabular font-medium">{platform.capacity_kg} кг</dd>
              </div>
              <div>
                <dt className="text-xs text-silver">Цена от</dt>
                <dd className="tabular font-medium">
                  {from != null ? `${formatEur(from)} / ден` : "—"}
                </dd>
              </div>
            </dl>
          </div>
          <Button
            type="button"
            onClick={openBooking}
            className="min-w-[10rem] justify-center self-end"
          >
            Резервирай
          </Button>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Gallery images={images} alt={platform.name} />
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <section>
              <h2 className="font-display text-lg font-semibold">
                Характеристики
              </h2>
              <div className="mt-3 overflow-hidden border border-silver">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {specs.map(([k, v], i) => (
                      <tr
                        key={k}
                        className={i % 2 === 0 ? "bg-white" : "bg-warm"}
                      >
                        <th
                          scope="row"
                          className="border-b border-silver px-3.5 py-2.5 font-medium text-steel"
                        >
                          {k}
                        </th>
                        <td className="tabular border-b border-silver px-3.5 py-2.5 font-medium">
                          {v}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold">
                Включено оборудване
              </h2>
              <ul className="mt-3 space-y-2 border border-silver bg-warm p-4">
                {sharedEquipment.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold">
                Подходяща за
              </h2>
              <ul className="mt-3 space-y-2 border border-silver bg-warm p-4">
                {platform.suitable_for.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <section className="mt-8 border border-silver">
          <div className="border-b border-silver bg-warm px-4 py-4 md:px-5">
            <h2 className="font-display text-lg font-semibold">Ценоразпис</h2>
            <p className="mt-1 text-xs text-steel">
              Ориентировъчни цени · {siteConfig.paymentNote}
            </p>
          </div>
          <div className="p-4 md:p-5">
            <PriceTable prices={platform.prices} />
          </div>
        </section>
      </div>

      <div id="rezervaciya" className="sr-only" aria-hidden />

      <BookingModal
        platformId={platform.id}
        platformName={platform.name}
        prices={platform.prices}
        initialBusy={busy}
        open={open}
        onClose={closeBooking}
      />
    </>
  );
}
