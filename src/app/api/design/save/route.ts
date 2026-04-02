import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Verify JWT
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { designId, templateId, paletteId, fontId, content } =
      await request.json();

    // Ensure the token's designId matches the request
    if (designId !== payload.designId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = createServerSupabase();

    const { error } = await supabase
      .from("designs")
      .upsert({
        id: designId,
        template_id: templateId,
        palette_id: paletteId,
        font_id: fontId,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", designId);

    if (error) {
      return NextResponse.json(
        { error: "Failed to save design" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      designId,
      savedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
