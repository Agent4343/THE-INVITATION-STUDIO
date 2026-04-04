import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { generateSuiteHtml } from "@/lib/pdf";
import { templates } from "@/data/templates";
import { palettes } from "@/data/palettes";
import { fonts } from "@/data/fonts";
import { normalizeLegacyDesignContent } from "@/lib/designContent";
import { getAdminFromRequest } from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: "User downloads are disabled. Files are fulfilled via Etsy by admin only." },
        { status: 403 },
      );
    }

    const { designId } = await request.json();
    if (!designId || typeof designId !== "string") {
      return NextResponse.json(
        { error: "Missing designId." },
        { status: 400 },
      );
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

    // Generate HTML for the full suite
    const html = generateSuiteHtml(
      { ...design, content: normalizedContent },
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
    console.error("PDF generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
