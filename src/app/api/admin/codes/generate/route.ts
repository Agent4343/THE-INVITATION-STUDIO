import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getAdminFromRequest } from "@/lib/adminAuth";
import { createServerSupabase } from "@/lib/supabase";

// Alphanumeric without ambiguous characters (0, O, 1, I, L)
const CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateCode(): string {
  const segments: string[] = [];
  for (let s = 0; s < 3; s++) {
    const bytes = randomBytes(4);
    let segment = "";
    for (let i = 0; i < 4; i++) {
      segment += CHARSET[bytes[i] % CHARSET.length];
    }
    segments.push(segment);
  }
  return segments.join("-");
}

export async function POST(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const count = Math.min(100, Math.max(1, parseInt(body.count, 10) || 10));

    const codes: string[] = [];
    const codeSet = new Set<string>();
    while (codes.length < count) {
      const code = generateCode();
      if (!codeSet.has(code)) {
        codeSet.add(code);
        codes.push(code);
      }
    }

    const supabase = createServerSupabase();

    const rows = codes.map((code) => ({
      code,
      status: "unused",
    }));

    const { error } = await supabase.from("access_codes").insert(rows);

    if (error) {
      console.error("Error inserting codes:", error);
      return NextResponse.json(
        { error: "Failed to generate codes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ codes });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
