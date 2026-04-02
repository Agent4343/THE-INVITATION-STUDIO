import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://theinvitationstudio.com";

const TIERS = {
  standard: {
    price: 2499,
    name: "Wedding Invitation Suite Builder",
  },
  premium: {
    price: 3499,
    name: "Premium Wedding Suite Builder",
  },
  complete: {
    price: 4999,
    name: "Complete Wedding Suite Builder + Premium Templates",
  },
} as const;

type Tier = keyof typeof TIERS;

function isValidTier(tier: string): tier is Tier {
  return tier in TIERS;
}

export async function POST(request: Request) {
  try {
    const { email, tier } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 },
      );
    }

    if (!tier || !isValidTier(tier)) {
      return NextResponse.json(
        { error: "Invalid tier. Must be standard, premium, or complete." },
        { status: 400 },
      );
    }

    const tierConfig = TIERS[tier];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: tierConfig.price,
            product_data: {
              name: tierConfig.name,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        tier,
        type: "access_purchase",
      },
      success_url: `${APP_URL}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}?cancelled=true`,
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch {
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 },
    );
  }
}
