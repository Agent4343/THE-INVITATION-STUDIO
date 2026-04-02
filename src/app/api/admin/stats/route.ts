import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/adminAuth";
import { createServerSupabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabase();

  // Run all queries in parallel
  const [
    codesResult,
    designsCountResult,
    ordersResult,
    revenueResult,
    recentDesignsResult,
    recentOrdersResult,
  ] = await Promise.all([
    // Access codes by status
    supabase.from("access_codes").select("status"),

    // Total designs
    supabase.from("designs").select("id", { count: "exact", head: true }),

    // Print orders by status
    supabase.from("print_orders").select("status, amount_paid"),

    // Revenue sum
    supabase.from("print_orders").select("amount_paid"),

    // Recent 10 designs with code info
    supabase
      .from("designs")
      .select("id, name, created_at, access_code_id, access_codes(code, couple_names)")
      .order("created_at", { ascending: false })
      .limit(10),

    // Recent 10 orders
    supabase
      .from("print_orders")
      .select("id, status, amount_paid, created_at, design_id")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  // Aggregate access code counts
  const codeCounts = { unused: 0, active: 0, completed: 0, total: 0 };
  if (codesResult.data) {
    for (const code of codesResult.data) {
      codeCounts.total++;
      const status = code.status as string;
      if (status in codeCounts) {
        codeCounts[status as keyof typeof codeCounts]++;
      }
    }
  }

  // Aggregate order counts and revenue
  const orderCounts: Record<string, number> = {};
  let totalRevenue = 0;
  if (ordersResult.data) {
    for (const order of ordersResult.data) {
      const status = order.status as string;
      orderCounts[status] = (orderCounts[status] || 0) + 1;
    }
  }
  if (revenueResult.data) {
    for (const order of revenueResult.data) {
      totalRevenue += Number(order.amount_paid) || 0;
    }
  }

  return NextResponse.json({
    accessCodes: codeCounts,
    designs: {
      total: designsCountResult.count ?? 0,
    },
    orders: {
      byStatus: orderCounts,
      total: ordersResult.data?.length ?? 0,
    },
    revenue: totalRevenue,
    recentDesigns: recentDesignsResult.data ?? [],
    recentOrders: recentOrdersResult.data ?? [],
  });
}
