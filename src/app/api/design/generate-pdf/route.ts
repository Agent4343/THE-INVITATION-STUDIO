import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { generateSuiteHtml } from "@/lib/pdf";
import { templates } from "@/data/templates";
import { palettes } from "@/data/palettes";
import { fonts } from "@/data/fonts";

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

    const { designId } = await request.json();

    if (designId !== payload.designId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = createServerSupabase();

    // Fetch design from Supabase
    const { data: design, error: fetchError } = await supabase
      .from("designs")
      .select("*")
      .eq("id", designId)
      .single();

    if (fetchError || !design) {
      return NextResponse.json(
        { error: "Design not found" },
        { status: 404 },
      );
    }

    // Look up template, palette, font
    const template = templates.find((t) => t.id === design.template_id);
    const palette = palettes.find((p) => p.id === design.palette_id);
    const font = fonts.find((f) => f.id === design.font_id);

    if (!template || !palette || !font) {
      return NextResponse.json(
        { error: "Invalid design configuration" },
        { status: 400 },
      );
    }

    // Generate HTML for the full suite
    const html = generateSuiteHtml(
      { ...design, content: design.content },
      template,
      palette,
      font,
    );

    // Update design record
    await supabase
      .from("designs")
      .update({ pdf_generated_at: new Date().toISOString() })
      .eq("id", designId);

    // Return HTML — client will open in new window for print-to-PDF
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: `PDF generation failed: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 500 },
    );
  }
}
