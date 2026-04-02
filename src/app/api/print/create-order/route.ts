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

    const { designId, items, shipping } = await request.json();

    if (designId !== payload.designId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!items?.length || !shipping) {
      return NextResponse.json(
        { error: "Missing items or shipping info" },
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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/print/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/print/cancel`,
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
        shipping,
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
