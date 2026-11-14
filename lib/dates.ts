const sofiaDateFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Sofia",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function sofiaToday(): string {
  return sofiaDateFmt.format(new Date());
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function formatISODate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function eachDateInclusive(startIso: string, endIso: string): string[] {
  const out: string[] = [];
  let cur = parseISODate(startIso);
  const end = parseISODate(endIso);
  while (cur.getTime() <= end.getTime()) {
    out.push(formatISODate(cur));
    cur = new Date(cur.getTime() + 86_400_000);
  }
  return out;
}

export function rangesToBusySet(
  ranges: { start_date: string; end_date: string }[],
): Set<string> {
  const set = new Set<string>();
  for (const r of ranges) {
    for (const d of eachDateInclusive(r.start_date, r.end_date)) {
      set.add(d);
    }
  }
  return set;
}

export function formatBgDate(iso: string): string {
  const d = parseISODate(iso);
  return new Intl.DateTimeFormat("bg-BG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}
