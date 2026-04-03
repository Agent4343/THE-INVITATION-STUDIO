import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

const SESSION_ID_PATTERN = /^cs_(test|live)_[A-Za-z0-9]+$/;

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

    if (!SESSION_ID_PATTERN.test(sessionId)) {
      return NextResponse.json(
        { error: "Invalid session_id." },
        { status: 400 },
      );
    }

    const supabase = createServerSupabase();

    const { data: accessCode, error } = await supabase
      .from("access_codes")
      .select("id")
      .eq("etsy_order_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !accessCode) {
      // Webhook may not have fired yet
      return NextResponse.json({ status: "processing" });
    }

    return NextResponse.json({
      status: "ready",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to check purchase status." },
      { status: 500 },
    );
  }
}
