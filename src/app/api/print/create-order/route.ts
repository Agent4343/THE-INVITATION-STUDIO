import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

const PAPER_PRICES: Record<string, number> = {
  standard: 0.5,
  premium: 0.75,
  cotton: 1.0,
};

const FLAT_SHIPPING = 9.99;
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://theinvitationstudio.com";
const ALLOWED_PIECES = new Set([
  "invitation",
  "rsvp",
  "details",
  "menu",
  "thankyou",
  "savethedate",
  "tablenumber",
  "placecard",
  "welcomesign",
]);

const TIER_BUNDLES: Record<
  string,
  Array<{ piece: string; quantity: number }>
> = {
  essential: [
    { piece: "invitation", quantity: 50 },
    { piece: "rsvp", quantity: 50 },
  ],
  classic: [
    { piece: "invitation", quantity: 100 },
    { piece: "rsvp", quantity: 100 },
  ],
  complete: [
    { piece: "invitation", quantity: 100 },
    { piece: "rsvp", quantity: 100 },
    { piece: "details", quantity: 100 },
    { piece: "menu", quantity: 100 },
    { piece: "thankyou", quantity: 100 },
  ],
};

type PrintItem = {
  piece: string;
  quantity: number;
  paper: string;
};

type ShippingAddress = {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

function normalizeString(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function normalizeShipping(raw: unknown): ShippingAddress | null {
  if (!raw || typeof raw !== "object") return null;
  const shipping = raw as Record<string, unknown>;
  const country = normalizeString(shipping.country, 2).toUpperCase() || "US";
  return {
    name: normalizeString(shipping.name, 100) || "Stripe Checkout Customer",
    address1: normalizeString(shipping.address1 ?? shipping.line1, 120),
    address2: normalizeString(shipping.address2 ?? shipping.line2, 120),
    city: normalizeString(shipping.city, 100),
    state: normalizeString(shipping.state, 100),
    zip: normalizeString(shipping.zip ?? shipping.postalCode, 20),
    country,
  };
}

function normalizeItems(rawBody: Record<string, unknown>): PrintItem[] | null {
  if (Array.isArray(rawBody.items)) {
    if (rawBody.items.length === 0 || rawBody.items.length > 20) return null;
    const normalized = rawBody.items
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const record = item as Record<string, unknown>;
        const piece = normalizeString(record.piece, 30).toLowerCase();
        const paper = normalizeString(record.paper, 20).toLowerCase();
        const quantity = Number(record.quantity);

        if (!ALLOWED_PIECES.has(piece)) return null;
        if (!(paper in PAPER_PRICES)) return null;
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 500) {
          return null;
        }

        return { piece, paper, quantity };
      })
      .filter((item): item is PrintItem => item !== null);

    return normalized.length === rawBody.items.length ? normalized : null;
  }

  const tier = normalizeString(rawBody.tier, 20).toLowerCase();
  const paperStock = normalizeString(rawBody.paperStock, 20).toLowerCase();
  if (!tier || !(tier in TIER_BUNDLES)) return null;
  if (!(paperStock in PAPER_PRICES)) return null;

  return TIER_BUNDLES[tier].map((item) => ({
    ...item,
    paper: paperStock,
  }));
}

export async function POST(request: Request) {
  try {
    // Verify JWT
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    let payload: ReturnType<typeof verifyToken>;
    try {
      payload = verifyToken(token);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawBody = await request.json();
    if (!rawBody || typeof rawBody !== "object") {
      return NextResponse.json(
        { error: "Invalid order payload" },
        { status: 400 },
      );
    }
    const body = rawBody as Record<string, unknown>;
    const designId =
      typeof body.designId === "string" ? body.designId : undefined;
    const items = normalizeItems(body);
    const shipping =
      normalizeShipping(body.shipping) || normalizeShipping(body.shippingAddress);

    if (designId !== payload.designId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!items?.length || !shipping) {
      return NextResponse.json(
        { error: "Invalid order payload" },
        { status: 400 },
      );
    }

    // Calculate line items for Stripe
    const lineItems = items.map(
      (item: { piece: string; quantity: number; paper: string }) => {
        const unitPrice = PAPER_PRICES[item.paper] ?? PAPER_PRICES.standard;
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${item.piece} (${item.paper} paper)`,
            },
            unit_amount: Math.round(unitPrice * 100), // cents
          },
          quantity: item.quantity,
        };
      },
    );

    // Add flat shipping
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Flat-rate shipping",
        },
        unit_amount: Math.round(FLAT_SHIPPING * 100),
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
      success_url: `${APP_URL}/print/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/print/cancel`,
      metadata: {
        designId,
      },
    });

    // Store pending order in Supabase
    const supabase = createServerSupabase();

    const { data: order, error: orderError } = await supabase
      .from("print_orders")
      .insert({
        design_id: designId,
        stripe_session_id: session.id,
        status: "pending",
        items,
        shipping_address: shipping,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 },
      );
    }

    return NextResponse.json({ checkoutUrl: session.url });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
