"use client";

import { useState, useEffect, useCallback } from "react";

interface Order {
  id: string;
  design_id: string;
  status: string;
  items: unknown[];
  amount_paid: number;
  tracking_number: string | null;
  shipping_address: Record<string, string> | null;
  stripe_session_id: string | null;
  prodigi_order_id: string | null;
  created_at: string;
  updated_at: string;
  designs: {
    id: string;
    template: string;
    content: { name1?: string; name2?: string } | null;
  } | null;
}

const STATUS_TABS = [
  "all",
  "pending",
  "paid",
  "printing",
  "shipped",
  "delivered",
] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  paid: "bg-blue-100 text-blue-700 border border-blue-300",
  submitted: "bg-indigo-100 text-indigo-700 border border-indigo-300",
  printing: "bg-purple-100 text-purple-700 border border-purple-300",
  shipped: "bg-orange-100 text-orange-700 border border-orange-300",
  delivered: "bg-green-100 text-green-700 border border-green-300",
  cancelled: "bg-red-100 text-red-700 border border-red-300",
};

const VALID_STATUSES = [
  "pending",
  "paid",
  "submitted",
  "printing",
  "shipped",
  "delivered",
  "cancelled",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
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

function summarizeItems(items: unknown[]): string {
  if (!Array.isArray(items) || items.length === 0) return "--";
  if (items.length === 1) return "1 item";
  return `${items.length} items`;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusSelections, setStatusSelections] = useState<Record<string, string>>({});

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("admin_token");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data.orders);
      setTotal(data.total);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  async function updateStatus(orderId: string) {
    const newStatus = statusSelections[orderId];
    if (!newStatus) return;

    setUpdatingId(orderId);
    setError("");
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status");
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
      setStatusSelections((prev) => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update status"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Print Orders</h2>
        <p className="text-slate-500 text-sm mt-1">
          Manage print orders and track fulfillment
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition ${
              statusFilter === tab
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="text-left px-4 py-3 font-medium">Order ID</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Items</th>
                <th className="text-left px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Tracking #</th>
                <th className="text-left px-4 py-3 font-medium">Created</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <>
                    <tr
                      key={order.id}
                      onClick={() =>
                        setExpandedId(
                          expandedId === order.id ? null : order.id
                        )
                      }
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-slate-700">
                          {order.id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            STATUS_COLORS[order.status] ||
                            "bg-slate-100 text-slate-600 border border-slate-300"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {summarizeItems(order.items)}
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {formatCurrency(order.amount_paid)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {order.tracking_number ? (
                          <span className="font-mono text-xs">
                            {order.tracking_number}
                          </span>
                        ) : (
                          <span className="text-slate-300">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {formatDate(order.created_at)}
                      </td>
                      <td
                        className="px-4 py-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={statusSelections[order.id] || order.status}
                            onChange={(e) =>
                              setStatusSelections((prev) => ({
                                ...prev,
                                [order.id]: e.target.value,
                              }))
                            }
                            disabled={updatingId === order.id}
                            className="text-xs rounded-md border border-slate-300 bg-white px-2 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {VALID_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => updateStatus(order.id)}
                            disabled={
                              updatingId === order.id ||
                              (!statusSelections[order.id] ||
                                statusSelections[order.id] === order.status)
                            }
                            className="px-2.5 py-1 text-xs font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            {updatingId === order.id ? "..." : "Update"}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {expandedId === order.id && (
                      <tr key={`${order.id}-detail`}>
                        <td colSpan={7} className="bg-slate-50 px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                            {/* Shipping Address */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-slate-900">
                                Shipping Address
                              </h4>
                              {order.shipping_address ? (
                                <div className="text-slate-600 space-y-0.5">
                                  {order.shipping_address.name && (
                                    <p className="font-medium text-slate-700">
                                      {order.shipping_address.name}
                                    </p>
                                  )}
                                  {order.shipping_address.line1 && (
                                    <p>{order.shipping_address.line1}</p>
                                  )}
                                  {order.shipping_address.line2 && (
                                    <p>{order.shipping_address.line2}</p>
                                  )}
                                  <p>
                                    {[
                                      order.shipping_address.city,
                                      order.shipping_address.state,
                                      order.shipping_address.postal_code,
                                    ]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </p>
                                  {order.shipping_address.country && (
                                    <p>{order.shipping_address.country}</p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-slate-400">
                                  No address on file
                                </p>
                              )}
                            </div>

                            {/* Order References */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-slate-900">
                                Order References
                              </h4>
                              <div className="space-y-1.5">
                                <p>
                                  <span className="font-medium text-slate-600">
                                    Stripe Session:
                                  </span>{" "}
                                  {order.stripe_session_id ? (
                                    <code className="text-xs font-mono text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200 break-all">
                                      {order.stripe_session_id}
                                    </code>
                                  ) : (
                                    <span className="text-slate-400">N/A</span>
                                  )}
                                </p>
                                <p>
                                  <span className="font-medium text-slate-600">
                                    Prodigi Order:
                                  </span>{" "}
                                  {order.prodigi_order_id ? (
                                    <code className="text-xs font-mono text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200 break-all">
                                      {order.prodigi_order_id}
                                    </code>
                                  ) : (
                                    <span className="text-slate-400">N/A</span>
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Design Info */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-slate-900">
                                Design Info
                              </h4>
                              {order.designs ? (
                                <div className="space-y-1.5">
                                  <p>
                                    <span className="font-medium text-slate-600">
                                      Template:
                                    </span>{" "}
                                    <span className="text-slate-700">
                                      {order.designs.template || "N/A"}
                                    </span>
                                  </p>
                                  {order.designs.content?.name1 && (
                                    <p>
                                      <span className="font-medium text-slate-600">
                                        Names:
                                      </span>{" "}
                                      <span className="text-slate-700">
                                        {order.designs.content.name1}
                                        {order.designs.content.name2 &&
                                          ` & ${order.designs.content.name2}`}
                                      </span>
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-slate-400">
                                  Design data unavailable
                                </p>
                              )}

                              <div className="pt-2 space-y-1.5">
                                <p>
                                  <span className="font-medium text-slate-600">
                                    Created:
                                  </span>{" "}
                                  <span className="text-slate-700">
                                    {formatDateTime(order.created_at)}
                                  </span>
                                </p>
                                <p>
                                  <span className="font-medium text-slate-600">
                                    Updated:
                                  </span>{" "}
                                  <span className="text-slate-700">
                                    {formatDateTime(order.updated_at)}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Items */}
                          {Array.isArray(order.items) &&
                            order.items.length > 0 && (
                              <div className="mt-4 space-y-2">
                                <h4 className="font-semibold text-slate-900 text-sm">
                                  Line Items
                                </h4>
                                <pre className="bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-700 overflow-auto max-h-40">
                                  {JSON.stringify(order.items, null, 2)}
                                </pre>
                              </div>
                            )}
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Showing {(page - 1) * limit + 1}
              {"\u2013"}
              {Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
