import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";
import { palettes } from "@/data/palettes";
import { fonts } from "@/data/fonts";
import { templates } from "@/data/templates";
import { buildEtsyDraftPayload, toEtsyPersonalizationNote } from "@/lib/etsy";
import {
  normalizeRouteKey,
  pickBestRoute,
  routeCandidates,
  type EtsyListingRoute,
} from "@/lib/etsyRoutes";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

function getPrimaryListingUrl(): string {
  const explicit = process.env.ETSY_CHECKOUT_LISTING_URL;
  if (explicit) return explicit;

  const shopUrl = getEnv("ETSY_SHOP_URL").replace(/\/+$/, "");
  const listingId = getEnv("ETSY_PRIMARY_LISTING_ID").trim();
  return `${shopUrl}/listing/${encodeURIComponent(listingId)}`;
}

function getMessageSellerUrl(): string {
  const explicit = process.env.ETSY_MESSAGE_SELLER_URL;
  if (explicit) return explicit;
  return `${getEnv("ETSY_SHOP_URL").replace(/\/+$/, "")}/contact`;
}

export async function POST(request: Request) {
  try {
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

    const body = (await request.json()) as {
      designId?: string;
      etsyPath?: "listing" | "message";
      packageTier?: string;
    };
    if (!body.designId || body.designId !== payload.designId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const packageTier = normalizeRouteKey(body.packageTier, "standard");

    const supabase = createServerSupabase();
    const { data: design, error } = await supabase
      .from("designs")
      .select("id, template_id, palette_id, font_id, content")
      .eq("id", body.designId)
      .single();

    if (error || !design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    const template = templates.find((item) => item.id === design.template_id);
    const palette = palettes.find((item) => item.id === design.palette_id);
    const font = fonts.find((item) => item.id === design.font_id);

    const draftPayload = buildEtsyDraftPayload({
      content: (design.content ?? {}) as Record<string, unknown>,
      templateName: template?.name || "Template",
      paletteName: palette?.name || "Palette",
      fontName: font?.name || "Font",
      packageTier,
    });

    const personalizationText = toEtsyPersonalizationNote(draftPayload);
    let selectedRoute: EtsyListingRoute | null = null;
    let checkoutUrl: string;

    if (body.etsyPath === "message") {
      checkoutUrl = getMessageSellerUrl();
    } else {
      const eventCandidates = routeCandidates(draftPayload.eventType);
      const tierCandidates = routeCandidates(packageTier);
      const { data: routeRows } = await supabase
        .from("etsy_listing_routes")
        .select("*")
        .eq("is_active", true)
        .in("event_type", eventCandidates)
        .in("package_tier", tierCandidates)
        .order("updated_at", { ascending: false });

      selectedRoute = pickBestRoute(
        (routeRows ?? []) as EtsyListingRoute[],
        normalizeRouteKey(draftPayload.eventType, "default"),
        packageTier,
      );

      checkoutUrl = selectedRoute?.listing_url || getPrimaryListingUrl();
    }

    return NextResponse.json({
      checkoutUrl,
      personalizationText,
      draftPayload,
      selectedRoute,
    });
  } catch (error) {
    console.error("Failed to prepare Etsy handoff:", error);
    return NextResponse.json(
      { error: "Failed to prepare Etsy checkout handoff." },
      { status: 500 },
    );
  }
}
