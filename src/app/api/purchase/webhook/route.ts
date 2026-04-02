import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase";
import { sendAccessCodeEmail } from "@/lib/email";
import { randomBytes } from "node:crypto";
import type Stripe from "stripe";

// Characters excluding ambiguous ones: 0, O, 1, I, L
const SAFE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateAccessCode(): string {
  const segments: string[] = [];
  for (let s = 0; s < 3; s++) {
    let segment = "";
    const bytes = randomBytes(4);
    for (let i = 0; i < 4; i++) {
      segment += SAFE_CHARS[bytes[i] % SAFE_CHARS.length];
    }
    segments.push(segment);
  }
  return segments.join("-");
}

export async function POST(request: Request) {
  let event: Stripe.Event;

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header." },
        { status: 400 },
      );
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json(
      { error: "Webhook signature verification failed." },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.metadata?.type !== "access_purchase") {
      // Not our concern — acknowledge and move on
      return NextResponse.json({ received: true });
    }

    const email = session.customer_email;
    const tier = session.metadata.tier || "standard";
    const code = generateAccessCode();
    const supabase = createServerSupabase();

    const { error: insertError } = await supabase
      .from("access_codes")
      .insert({
        code,
        status: "unused",
        tier,
        email,
        etsy_order_id: session.id,
      });

    if (insertError) {
      console.error("Failed to insert access code:", insertError);
      return NextResponse.json(
        { error: "Failed to provision access code." },
        { status: 500 },
      );
    }

    try {
      if (email) {
        await sendAccessCodeEmail(email, code, tier);
      }
    } catch (emailError) {
      // Log but don't fail the webhook — the code is already created
      console.error("Failed to send access code email:", emailError);
    }
  }

  return NextResponse.json({ received: true });
}
