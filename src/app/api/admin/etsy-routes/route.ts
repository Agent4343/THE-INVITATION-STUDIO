import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/adminAuth";
import { createServerSupabase } from "@/lib/supabase";
import { normalizeRouteKey } from "@/lib/etsyRoutes";

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("etsy_listing_routes")
    .select("*")
    .order("event_type", { ascending: true })
    .order("package_tier", { ascending: true });

  if (error) {
    console.error("Error loading Etsy listing routes:", error);
    return NextResponse.json(
      { error: "Failed to fetch Etsy routes." },
      { status: 500 },
    );
  }

  return NextResponse.json({ routes: data ?? [] });
}

export async function POST(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      eventType?: string;
      packageTier?: string;
      listingUrl?: string;
      listingLabel?: string;
      isActive?: boolean;
    };

    const eventType = normalizeRouteKey(body.eventType, "default");
    const packageTier = normalizeRouteKey(body.packageTier, "default");
    const listingUrl = (body.listingUrl || "").trim();
    const listingLabel = (body.listingLabel || "").trim() || "Etsy Listing";
    const isActive = body.isActive !== false;

    if (!isValidUrl(listingUrl)) {
      return NextResponse.json(
        { error: "A valid listing URL is required." },
        { status: 400 },
      );
    }

    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("etsy_listing_routes")
      .insert({
        event_type: eventType,
        package_tier: packageTier,
        listing_url: listingUrl,
        listing_label: listingLabel.slice(0, 120),
        is_active: isActive,
      })
      .select("*")
      .single();

    if (error) {
      const duplicate =
        error.code === "23505" ||
        String(error.message).toLowerCase().includes("unique");
      return NextResponse.json(
        {
          error: duplicate
            ? "A route for this event type and package tier already exists."
            : "Failed to create Etsy route.",
        },
        { status: duplicate ? 409 : 500 },
      );
    }

    return NextResponse.json({ route: data });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }
}

