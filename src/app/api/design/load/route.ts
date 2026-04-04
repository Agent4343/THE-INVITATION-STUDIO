import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { normalizeLegacyDesignContent } from "@/lib/designContent";

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const designId = searchParams.get("designId");

    if (!designId) {
      return NextResponse.json(
        { error: "Missing designId parameter" },
        { status: 400 },
      );
    }

    // Ensure the token's designId matches the request
    if (designId !== payload.designId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = createServerSupabase();

    const { data: design, error } = await supabase
      .from("designs")
      .select("template_id, palette_id, font_id, content")
      .eq("id", designId)
      .single();

    if (error || !design) {
      return NextResponse.json(
        { error: "Design not found" },
        { status: 404 },
      );
    }

    const { content: normalizedContent, changed } = normalizeLegacyDesignContent(
      design.content,
    );

    if (changed) {
      await supabase
        .from("designs")
        .update({
          content: normalizedContent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", designId);
    }

    return NextResponse.json({
      design: {
        templateId: design.template_id,
        paletteId: design.palette_id,
        fontId: design.font_id,
        content: normalizedContent,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
