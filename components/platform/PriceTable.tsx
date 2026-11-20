import { formatEur } from "@/lib/pricing";
import type { PlatformPrice } from "@/lib/types";
import { siteConfig } from "@/lib/site-config";

type Props = {
  prices: PlatformPrice[];
};

export function PriceTable({ prices }: Props) {
  return (
    <div>
      <div className="overflow-x-auto border border-silver">
        <table className="w-full min-w-[280px] text-left text-sm">
          <caption className="sr-only">Ценоразпис по дни</caption>
          <thead className="bg-graphite text-white">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Дни
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Цена
              </th>
            </tr>
          </thead>
          <tbody>
            {prices.map((row, i) => (
              <tr
                key={row.days}
                className={i % 2 === 0 ? "bg-white" : "bg-warm"}
              >
                <td className="tabular border-t border-silver px-4 py-2.5">
                  {row.days}
                </td>
                <td className="tabular border-t border-silver px-4 py-2.5 font-medium">
                  {formatEur(row.total_eur)}{" "}
                  <span className="font-normal text-steel">
                    ({Math.round(row.total_eur / row.days)}&nbsp;€/ден)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-steel">
        {siteConfig.priceDisclaimer}
      </p>
      <p className="mt-1 text-xs text-steel">{siteConfig.longTermNote}</p>
      <p className="mt-1 text-xs text-steel">{siteConfig.loyaltyNote}</p>
    </div>
  );
}
