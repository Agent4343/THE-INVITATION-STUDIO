import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import {
  buildEtsyDraftPayload,
  type EtsyAddonInput,
  type EtsyBundleConfig,
  deriveDealFromSelection,
  normalizeSelectedItems,
  toEtsyPersonalizationNote,
} from "@/lib/etsy";
import {
  normalizeRouteKey,
  pickBestRoute,
  routeCandidates,
  type EtsyListingRoute,
} from "@/lib/etsyRoutes";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const PREVIEW_CHECKOUT_LIMIT = {
  windowMs: 10 * 60 * 1000,
  maxRequests: 40,
};

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

function isContentRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function loadBundleConfig(supabase: ReturnType<typeof createServerSupabase>) {
  const { data } = await supabase
    .from("etsy_bundle_configs")
    .select(
      "is_active,min_distinct_items,deal_code,unlocked_message,locked_message",
    )
    .eq("singleton_key", "default")
    .maybeSingle();

  if (!data) return undefined;

  const config: Partial<EtsyBundleConfig> = {
    isActive: data.is_active,
    minDistinctItems: data.min_distinct_items,
    code: data.deal_code,
    unlockedMessage: data.unlocked_message,
    lockedMessage: data.locked_message,
  };
  return config;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(
      `etsy-preview-checkout:${ip}`,
      PREVIEW_CHECKOUT_LIMIT,
    );
    if (rateLimit.limited) {
      return NextResponse.json(
        { error: "RATE_LIMITED" },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const body = (await request.json()) as {
      etsyPath?: "listing" | "message";
      selectedItems?: unknown;
      content?: unknown;
      templateName?: string;
      paletteName?: string;
      fontName?: string;
      selectedAddons?: unknown;
    };

    if (!isContentRecord(body.content)) {
      return NextResponse.json(
        { error: "Missing design content for preview checkout." },
        { status: 400 },
      );
    }

    const normalizedItems = normalizeSelectedItems(
      Array.isArray(body.selectedItems)
        ? (body.selectedItems as Array<{ id?: string; quantity?: number }>)
        : undefined,
    );

    const selectedAddons: EtsyAddonInput[] = Array.isArray(body.selectedAddons)
      ? body.selectedAddons.map((item) => {
          if (typeof item === "string") return { id: item };
          if (typeof item === "object" && item !== null) {
            return { id: (item as { id?: unknown }).id as string | undefined };
          }
          return { id: undefined };
        })
      : [];

    const supabase = createServerSupabase();
    const bundleConfig = await loadBundleConfig(supabase);

    const draftPayload = buildEtsyDraftPayload({
      content: body.content,
      templateName: String(body.templateName || "Template"),
      paletteName: String(body.paletteName || "Palette"),
      fontName: String(body.fontName || "Font"),
      selectedItems: normalizedItems,
      selectedAddons,
      bundleConfig,
    });
    const deal = deriveDealFromSelection(draftPayload.lineItems, bundleConfig);
    const personalizationText = toEtsyPersonalizationNote(draftPayload);

    let selectedRoute: EtsyListingRoute | null = null;
    let checkoutUrl: string;

    if (body.etsyPath === "message") {
      checkoutUrl = getMessageSellerUrl();
    } else {
      const eventCandidates = routeCandidates(draftPayload.eventType);
      const { data: routeRows } = await supabase
        .from("etsy_listing_routes")
        .select("*")
        .eq("is_active", true)
        .in("event_type", eventCandidates)
        .order("updated_at", { ascending: false });

      selectedRoute = pickBestRoute(
        (routeRows ?? []) as EtsyListingRoute[],
        normalizeRouteKey(draftPayload.eventType, "default"),
      );

      checkoutUrl = selectedRoute?.listing_url || getPrimaryListingUrl();
    }

    return NextResponse.json({
      checkoutUrl,
      personalizationText,
      draftPayload,
      deal,
      selectedRoute,
      previewMode: true,
    });
  } catch (error) {
    console.error("Failed to prepare Etsy preview handoff:", error);
    return NextResponse.json(
      { error: "Failed to prepare Etsy checkout handoff." },
      { status: 500 },
    );
  }
}
