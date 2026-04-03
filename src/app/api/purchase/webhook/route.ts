import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase";
import { sendAccessCodeEmail } from "@/lib/email";
import { randomBytes } from "node:crypto";
import type Stripe from "stripe";

// Characters excluding ambiguous ones: 0, O, 1, I, L
const SAFE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const WEBHOOK_SECRET =
  process.env.STRIPE_PURCHASE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;

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

    if (!WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Webhook secret not configured." },
        { status: 500 },
      );
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      WEBHOOK_SECRET,
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
    const supabase = createServerSupabase();

    // Idempotency: if this session already produced a code, acknowledge and stop.
    const { data: existingCode, error: existingLookupError } = await supabase
      .from("access_codes")
      .select("code")
      .eq("etsy_order_id", session.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingLookupError) {
      console.error("Failed to check existing access code:", existingLookupError);
      return NextResponse.json(
        { error: "Failed to provision access code." },
        { status: 500 },
      );
    }

    let code = existingCode?.code ?? null;
    if (!code) {
      // Retry a few times if random code collisions occur.
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const candidate = generateAccessCode();
        const { error: insertError } = await supabase
          .from("access_codes")
          .insert({
            code: candidate,
            status: "unused",
            tier,
            email,
            etsy_order_id: session.id,
          });

        if (!insertError) {
          code = candidate;
          break;
        }

        // Handle race conditions and duplicate event delivery safely.
        if (
          insertError.code === "23505" &&
          String(insertError.message).includes("etsy_order_id")
        ) {
          const { data: raceWinner } = await supabase
            .from("access_codes")
            .select("code")
            .eq("etsy_order_id", session.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          code = raceWinner?.code ?? null;
          if (code) break;
          continue;
        }

        if (insertError.code === "23505") {
          continue;
        }

        console.error("Failed to insert access code:", insertError);
        return NextResponse.json(
          { error: "Failed to provision access code." },
          { status: 500 },
        );
      }
    }

    if (!code) {
      console.error("Failed to provision unique access code after retries");
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
