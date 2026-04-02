import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { generateSuitePdf } from "@/lib/pdf";
import { uploadPdf, getSignedDownloadUrl } from "@/lib/storage";
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

    // Generate PDF
    const pdfBuffer = await generateSuitePdf(design, template, palette, font);

    // Upload to storage
    const key = `pdfs/${designId}/${Date.now()}.pdf`;
    await uploadPdf(key, pdfBuffer);

    // Get signed download URL
    const downloadUrl = await getSignedDownloadUrl(key);
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    // Update design record with pdf_url
    await supabase
      .from("designs")
      .update({ pdf_url: key, updated_at: new Date().toISOString() })
      .eq("id", designId);

    return NextResponse.json({ downloadUrl, expiresAt });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
