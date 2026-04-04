import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/adminAuth";
import { createServerSupabase } from "@/lib/supabase";

const DEFAULT_CONFIG = {
  singleton_key: "default",
  is_active: true,
  min_distinct_items: 4,
  deal_code: "STUDIO4PLUS",
  unlocked_message:
    "Mix & Match 4+ perk unlocked. Ask seller to apply STUDIO4PLUS for bundle savings and coordinated finishing recommendations.",
  locked_message:
    "Add 4 or more different pieces to unlock the STUDIO4PLUS bundle perk on Etsy.",
};

export async function GET(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("etsy_bundle_configs")
    .select("*")
    .eq("singleton_key", "default")
    .maybeSingle();

  if (error) {
    console.error("Failed to load Etsy bundle config:", error);
    return NextResponse.json(
      { error: "Failed to load Etsy bundle config." },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ config: DEFAULT_CONFIG });
  }

  return NextResponse.json({ config: data });
}

export async function PATCH(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      isActive?: boolean;
      minDistinctItems?: number;
      dealCode?: string;
      unlockedMessage?: string;
      lockedMessage?: string;
    };

    const updates: Record<string, unknown> = {};
    if (body.isActive !== undefined) {
      updates.is_active = Boolean(body.isActive);
    }
    if (body.minDistinctItems !== undefined) {
      const n = Number(body.minDistinctItems);
      if (!Number.isInteger(n) || n < 1 || n > 9) {
        return NextResponse.json(
          { error: "minDistinctItems must be an integer between 1 and 9." },
          { status: 400 },
        );
      }
      updates.min_distinct_items = n;
    }
    if (body.dealCode !== undefined) {
      const code = String(body.dealCode).trim().slice(0, 64);
      if (!code) {
        return NextResponse.json(
          { error: "dealCode cannot be empty." },
          { status: 400 },
        );
      }
      updates.deal_code = code;
    }
    if (body.unlockedMessage !== undefined) {
      const value = String(body.unlockedMessage).trim().slice(0, 400);
      if (!value) {
        return NextResponse.json(
          { error: "unlockedMessage cannot be empty." },
          { status: 400 },
        );
      }
      updates.unlocked_message = value;
    }
    if (body.lockedMessage !== undefined) {
      const value = String(body.lockedMessage).trim().slice(0, 400);
      if (!value) {
        return NextResponse.json(
          { error: "lockedMessage cannot be empty." },
          { status: 400 },
        );
      }
      updates.locked_message = value;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update." },
        { status: 400 },
      );
    }

    const supabase = createServerSupabase();

    const { data: existing, error: existingError } = await supabase
      .from("etsy_bundle_configs")
      .select("id")
      .eq("singleton_key", "default")
      .maybeSingle();
    if (existingError) {
      console.error("Failed to load existing Etsy bundle config:", existingError);
      return NextResponse.json(
        { error: "Failed to update Etsy bundle config." },
        { status: 500 },
      );
    }

    if (!existing) {
      const { data, error } = await supabase
        .from("etsy_bundle_configs")
        .insert({
          ...DEFAULT_CONFIG,
          ...updates,
        })
        .select("*")
        .single();
      if (error) {
        console.error("Failed to create Etsy bundle config:", error);
        return NextResponse.json(
          { error: "Failed to update Etsy bundle config." },
          { status: 500 },
        );
      }
      return NextResponse.json({ config: data });
    }

    const { data, error } = await supabase
      .from("etsy_bundle_configs")
      .update(updates)
      .eq("singleton_key", "default")
      .select("*")
      .single();
    if (error) {
      console.error("Failed to update Etsy bundle config:", error);
      return NextResponse.json(
        { error: "Failed to update Etsy bundle config." },
        { status: 500 },
      );
    }

    return NextResponse.json({ config: data });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }
}
