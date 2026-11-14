const sofiaDateFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Sofia",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function sofiaToday(): string {
  return sofiaDateFmt.format(new Date());
}

export function formatISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseISODateLocal(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function eachDateInclusive(startIso: string, endIso: string): string[] {
  const out: string[] = [];
  let cur = parseISODateLocal(startIso);
  const end = parseISODateLocal(endIso);
  while (cur.getTime() <= end.getTime()) {
    out.push(formatISODate(cur));
    cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1);
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
