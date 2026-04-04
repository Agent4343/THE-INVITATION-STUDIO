import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const TRACK_LIMIT = {
  windowMs: 10 * 60 * 1000,
  maxRequests: 200,
};

const ALLOWED_EVENTS = new Set([
  "home_etsy_click",
  "home_preview_mode_click",
  "code_redeem_success",
  "code_redeem_error",
  "code_redeem_network_error",
  "etsy_handoff_success",
  "etsy_handoff_error",
]);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeMetadata(value: unknown): Record<string, unknown> {
  if (!isObject(value)) return {};
  const entries = Object.entries(value).slice(0, 20);
  const safe: Record<string, unknown> = {};
  for (const [key, raw] of entries) {
    const safeKey = String(key).slice(0, 40);
    if (!safeKey) continue;
    if (
      typeof raw === "string" ||
      typeof raw === "number" ||
      typeof raw === "boolean" ||
      raw === null
    ) {
      safe[safeKey] = raw;
      continue;
    }
    safe[safeKey] = String(raw).slice(0, 200);
  }
  return safe;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`analytics-track:${ip}`, TRACK_LIMIT);
    if (rateLimit.limited) {
      return NextResponse.json(
        { ok: false, error: "RATE_LIMITED" },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const body = (await request.json()) as {
      eventName?: unknown;
      path?: unknown;
      sessionId?: unknown;
      metadata?: unknown;
    };

    const eventName = String(body.eventName || "").trim();
    if (!ALLOWED_EVENTS.has(eventName)) {
      return NextResponse.json({ ok: false, error: "INVALID_EVENT" }, { status: 400 });
    }

    const path = String(body.path || "/").slice(0, 200);
    const sessionId = String(body.sessionId || "").slice(0, 80);
    if (!sessionId) {
      return NextResponse.json({ ok: false, error: "MISSING_SESSION" }, { status: 400 });
    }

    const metadata = normalizeMetadata(body.metadata);
    const supabase = createServerSupabase();
    await supabase.from("conversion_events").insert({
      event_name: eventName,
      path,
      session_id: sessionId,
      metadata,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
