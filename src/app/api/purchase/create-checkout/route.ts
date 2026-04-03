import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Direct checkout is disabled. Complete payment on Etsy and redeem your access code in the app.",
    },
    { status: 410 },
  );
}
