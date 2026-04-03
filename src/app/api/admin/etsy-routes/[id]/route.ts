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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = (await request.json()) as {
      eventType?: string;
      listingUrl?: string;
      listingLabel?: string;
      isActive?: boolean;
    };

    const updates: Record<string, unknown> = {};

    if (body.eventType !== undefined) {
      updates.event_type = normalizeRouteKey(body.eventType, "default");
    }
    updates.package_tier = "default";
    if (body.listingUrl !== undefined) {
      const listingUrl = String(body.listingUrl).trim();
      if (!isValidUrl(listingUrl)) {
        return NextResponse.json(
          { error: "A valid listing URL is required." },
          { status: 400 },
        );
      }
      updates.listing_url = listingUrl;
    }
    if (body.listingLabel !== undefined) {
      updates.listing_label = String(body.listingLabel).trim().slice(0, 120);
    }
    if (body.isActive !== undefined) {
      updates.is_active = Boolean(body.isActive);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update." },
        { status: 400 },
      );
    }

    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("etsy_listing_routes")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      const duplicate =
        error.code === "23505" ||
        String(error.message).toLowerCase().includes("unique");
      return NextResponse.json(
        {
          error: duplicate
            ? "A route for this event type already exists."
            : "Failed to update Etsy route.",
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createServerSupabase();

  const { error } = await supabase
    .from("etsy_listing_routes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete Etsy route:", error);
    return NextResponse.json(
      { error: "Failed to delete Etsy route." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

