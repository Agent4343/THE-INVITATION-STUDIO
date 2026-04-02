import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id is required." },
        { status: 400 },
      );
    }

    const supabase = createServerSupabase();

    const { data: accessCode, error } = await supabase
      .from("access_codes")
      .select("code, email")
      .eq("etsy_order_id", sessionId)
      .single();

    if (error || !accessCode) {
      // Webhook may not have fired yet
      return NextResponse.json({ status: "processing" });
    }

    return NextResponse.json({
      status: "ready",
      code: accessCode.code,
      email: accessCode.email,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to check purchase status." },
      { status: 500 },
    );
  }
}
