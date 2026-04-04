import { NextResponse } from "next/server";

const DISABLED_MESSAGE =
  "PNG download is disabled. Preview in app, then complete payment on Etsy. Final files are fulfilled by admin.";

export async function GET() {
  return NextResponse.json({ error: DISABLED_MESSAGE }, { status: 403 });
}

export async function POST() {
  return NextResponse.json({ error: DISABLED_MESSAGE }, { status: 403 });
}
