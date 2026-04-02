"use client";

import { useEffect, useState } from "react";

interface Stats {
  accessCodes: {
    total: number;
    unused: number;
    active: number;
    completed: number;
  };
  designs: { total: number };
  orders: {
    total: number;
    byStatus: Record<string, number>;
  };
  revenue: number;
  recentDesigns: Array<{
    id: string;
    name: string;
    created_at: string;
    access_codes?: { code: string; couple_names: string } | null;
  }>;
  recentOrders: Array<{
    id: string;
    status: string;
    amount_paid: number;
    created_at: string;
    design_id: string;
  }>;
}

function StatCard({
  title,
  value,
  subtitle,
  accent,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className={`text-3xl font-bold mt-1 ${accent || "text-slate-900"}`}>
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-400">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  const orderStatusLabels: Record<string, string> = {
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">
          Overview of your invitation studio
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Access Codes"
          value={stats.accessCodes.total}
          subtitle={`${stats.accessCodes.unused} unused / ${stats.accessCodes.active} active / ${stats.accessCodes.completed} completed`}
        />
        <StatCard
          title="Designs Created"
          value={stats.designs.total}
        />
        <StatCard
          title="Print Orders"
          value={stats.orders.total}
          subtitle={Object.entries(stats.orders.byStatus)
            .map(([s, c]) => `${c} ${orderStatusLabels[s] || s}`)
            .join(" / ")}
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(stats.revenue)}
          accent="text-emerald-600"
        />
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent designs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Recent Designs</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {stats.recentDesigns.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-400 text-sm">
                No designs yet
              </div>
            ) : (
              stats.recentDesigns.map((design) => (
                <div
                  key={design.id}
                  className="px-6 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {design.name || "Untitled"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {design.access_codes?.couple_names || "Unknown"}{" "}
                      &middot; {design.access_codes?.code || "N/A"}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {formatDate(design.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Recent Orders</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {stats.recentOrders.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-400 text-sm">
                No orders yet
              </div>
            ) : (
              stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="px-6 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {formatCurrency(order.amount_paid)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {orderStatusLabels[order.status] || order.status}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {formatDate(order.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
