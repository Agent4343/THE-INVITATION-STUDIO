import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { templates } from "@/data/templates";
import { palettes } from "@/data/palettes";
import { fonts } from "@/data/fonts";
import { normalizeLegacyDesignContent } from "@/lib/designContent";

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

    // Validate IDs against known data
    if (!templates.find((t) => t.id === templateId)) {
      return NextResponse.json({ error: "Invalid templateId" }, { status: 400 });
    }
    if (!palettes.find((p) => p.id === paletteId)) {
      return NextResponse.json({ error: "Invalid paletteId" }, { status: 400 });
    }
    if (!fonts.find((f) => f.id === fontId)) {
      return NextResponse.json({ error: "Invalid fontId" }, { status: 400 });
    }
    if (typeof content !== "object" || content === null || Array.isArray(content)) {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    const { content: normalizedContent } = normalizeLegacyDesignContent(content);

    const supabase = createServerSupabase();

    const { error } = await supabase
      .from("designs")
      .upsert({
        id: designId,
        template_id: templateId,
        palette_id: paletteId,
        font_id: fontId,
        content: normalizedContent,
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
