import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { createToken } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const CODE_PATTERN = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const CODE_VALIDATE_LIMIT = {
  windowMs: 10 * 60 * 1000,
  maxRequests: 30,
};

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`auth-validate:${ip}`, CODE_VALIDATE_LIMIT);
    if (rateLimit.limited) {
      return NextResponse.json(
        { valid: false, error: "RATE_LIMITED" },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const { code } = await request.json();

    if (!code || !CODE_PATTERN.test(code)) {
      return NextResponse.json(
        { valid: false, error: "INVALID_CODE" },
        { status: 400 },
      );
    }

    const supabase = createServerSupabase();

    // Look up the access code
    const { data: accessCode, error: lookupError } = await supabase
      .from("access_codes")
      .select("*")
      .eq("code", code)
      .single();

    if (lookupError || !accessCode) {
      return NextResponse.json(
        { valid: false, error: "INVALID_CODE" },
        { status: 404 },
      );
    }

    // Check if expired
    if (
      accessCode.status === "expired" ||
      (accessCode.expires_at && new Date(accessCode.expires_at) < new Date())
    ) {
      return NextResponse.json(
        { valid: false, error: "EXPIRED" },
        { status: 410 },
      );
    }

    // If already active or completed, return existing design
    if (accessCode.status === "active" || accessCode.status === "completed") {
      const token = createToken({
        designId: accessCode.design_id,
        codeId: accessCode.id,
      });

      return NextResponse.json({
        valid: true,
        designId: accessCode.design_id,
        token,
      });
    }

    // Unused code: create a new design with defaults
    const { data: design, error: designError } = await supabase
      .from("designs")
      .insert({
        template_id: "classic-elegance",
        palette_id: "sage-gold",
        font_id: "playfair-display",
        content: {},
      })
      .select("id")
      .single();

    if (designError || !design) {
      return NextResponse.json(
        { valid: false, error: "SERVER_ERROR" },
        { status: 500 },
      );
    }

    // Update access code to active with the new design id
    const { error: updateError } = await supabase
      .from("access_codes")
      .update({ status: "active", design_id: design.id })
      .eq("id", accessCode.id);

    if (updateError) {
      return NextResponse.json(
        { valid: false, error: "SERVER_ERROR" },
        { status: 500 },
      );
    }

    const token = createToken({
      designId: design.id,
      codeId: accessCode.id,
    });

    return NextResponse.json({
      valid: true,
      designId: design.id,
      token,
    });
  } catch {
    return NextResponse.json(
      { valid: false, error: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
