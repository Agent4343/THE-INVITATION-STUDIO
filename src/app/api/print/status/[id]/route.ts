import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { getProdigiOrderStatus } from "@/lib/prodigi";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Verify JWT
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    try {
      verifyToken(token);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createServerSupabase();

    const { data: order, error } = await supabase
      .from("print_orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let trackingNumber: string | null = null;
    let estimatedDelivery: string | null = null;
    let status = order.status;

    // If there is a Prodigi order, fetch latest status
    if (order.prodigi_order_id) {
      try {
        const prodigiStatus = await getProdigiOrderStatus(
          order.prodigi_order_id,
        );

        const prodigiOrder = prodigiStatus?.order ?? prodigiStatus;
        status = prodigiOrder?.status?.stage ?? order.status;
        trackingNumber =
          prodigiOrder?.shipments?.[0]?.tracking?.number ?? null;
        estimatedDelivery =
          prodigiOrder?.shipments?.[0]?.tracking?.estimatedDelivery ?? null;

        // Update local status if changed
        if (status !== order.status) {
          await supabase
            .from("print_orders")
            .update({ status })
            .eq("id", order.id);
        }
      } catch (prodigiError) {
        console.error("Failed to fetch Prodigi status:", prodigiError);
        // Fall back to local status
      }
    }

    return NextResponse.json({
      status,
      trackingNumber,
      estimatedDelivery,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
