import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase";
import { createProdigiOrder } from "@/lib/prodigi";
import { sendOrderConfirmation } from "@/lib/resend";
import { getSignedDownloadUrl } from "@/lib/storage";
import type Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 },
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const supabase = createServerSupabase();

      // Find the order by stripe session id
      const { data: order, error: orderError } = await supabase
        .from("print_orders")
        .select("*")
        .eq("stripe_session_id", session.id)
        .single();

      if (orderError || !order) {
        console.error("Order not found for session:", session.id);
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // Update order status to paid
      await supabase
        .from("print_orders")
        .update({ status: "paid" })
        .eq("id", order.id);

      // Get the design's PDF URL for Prodigi
      const { data: design } = await supabase
        .from("designs")
        .select("pdf_url")
        .eq("id", order.design_id)
        .single();

      const pdfUrl = design?.pdf_url
        ? await getSignedDownloadUrl(design.pdf_url)
        : "";

      // Submit to Prodigi
      try {
        const prodigiResult = await createProdigiOrder(
          pdfUrl,
          order.items,
          order.shipping,
        );

        const prodigiOrderId =
          prodigiResult?.order?.id ?? prodigiResult?.id ?? null;

        await supabase
          .from("print_orders")
          .update({
            status: "submitted",
            prodigi_order_id: prodigiOrderId,
          })
          .eq("id", order.id);
      } catch (prodigiError) {
        console.error("Prodigi order creation failed:", prodigiError);
        // Order is still marked as paid; can be retried manually
      }

      // Send confirmation email
      const customerEmail =
        session.customer_details?.email ?? session.customer_email;
      if (customerEmail) {
        try {
          await sendOrderConfirmation(customerEmail, order.id);
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
