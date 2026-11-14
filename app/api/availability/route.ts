import { NextResponse } from "next/server";
import { getBusyRanges } from "@/lib/bookings";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platformId = searchParams.get("platformId");
  if (!platformId) {
    return NextResponse.json({ error: "platformId required" }, { status: 400 });
  }

  try {
    const ranges = await getBusyRanges(platformId);
    return NextResponse.json(ranges);
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
