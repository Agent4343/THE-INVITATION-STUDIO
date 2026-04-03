"use client";

import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  interface EtsyRoute {
    id: string;
    event_type: string;
    package_tier: string;
    listing_url: string;
    listing_label: string;
    is_active: boolean;
    updated_at: string | null;
  }

  const [adminEmail, setAdminEmail] = useState("");

  // Change password form
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [etsyRoutes, setEtsyRoutes] = useState<EtsyRoute[]>([]);
  const [loadingEtsyRoutes, setLoadingEtsyRoutes] = useState(false);
  const [etsyMessage, setEtsyMessage] = useState("");
  const [etsyError, setEtsyError] = useState("");
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  const [routeForm, setRouteForm] = useState({
    eventType: "default",
    packageTier: "default",
    listingUrl: "",
    listingLabel: "",
    isActive: true,
  });

  useEffect(() => {
    const email = localStorage.getItem("admin_email") || "";
    setAdminEmail(email);
    void loadEtsyRoutes();
  }, []);

  async function loadEtsyRoutes() {
    setLoadingEtsyRoutes(true);
    setEtsyError("");
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/etsy-routes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load Etsy routes");
      }
      setEtsyRoutes(data.routes ?? []);
    } catch (err) {
      setEtsyError(
        err instanceof Error ? err.message : "Failed to load Etsy routes",
      );
    } finally {
      setLoadingEtsyRoutes(false);
    }
  }

  function resetRouteForm() {
    setEditingRouteId(null);
    setRouteForm({
      eventType: "default",
      packageTier: "default",
      listingUrl: "",
      listingLabel: "",
      isActive: true,
    });
  }

  function startEditRoute(route: EtsyRoute) {
    setEditingRouteId(route.id);
    setRouteForm({
      eventType: route.event_type,
      packageTier: route.package_tier,
      listingUrl: route.listing_url,
      listingLabel: route.listing_label,
      isActive: route.is_active,
    });
    setEtsyError("");
    setEtsyMessage("");
  }

  async function handleSaveRoute() {
    setEtsyMessage("");
    setEtsyError("");

    try {
      const token = localStorage.getItem("admin_token");
      const routeBody = {
        eventType: routeForm.eventType,
        packageTier: routeForm.packageTier,
        listingUrl: routeForm.listingUrl,
        listingLabel: routeForm.listingLabel,
        isActive: routeForm.isActive,
      };
      const endpoint = editingRouteId
        ? `/api/admin/etsy-routes/${editingRouteId}`
        : "/api/admin/etsy-routes";
      const method = editingRouteId ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routeBody),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save Etsy route");
      }

      setEtsyMessage(
        editingRouteId
          ? "Etsy route updated."
          : "Etsy route created.",
      );
      resetRouteForm();
      await loadEtsyRoutes();
    } catch (err) {
      setEtsyError(
        err instanceof Error ? err.message : "Failed to save Etsy route",
      );
    }
  }

  async function handleDeleteRoute(id: string) {
    const confirmed = window.confirm(
      "Delete this Etsy listing route? This cannot be undone.",
    );
    if (!confirmed) return;

    setEtsyMessage("");
    setEtsyError("");

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/admin/etsy-routes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete Etsy route");
      }

      setEtsyMessage("Etsy route deleted.");
      if (editingRouteId === id) {
        resetRouteForm();
      }
      await loadEtsyRoutes();
    } catch (err) {
      setEtsyError(
        err instanceof Error ? err.message : "Failed to delete Etsy route",
      );
    }
  }

  async function handleToggleRoute(route: EtsyRoute) {
    setEtsyMessage("");
    setEtsyError("");

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/admin/etsy-routes/${route.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !route.is_active }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update Etsy route");
      }

      setEtsyMessage("Route status updated.");
      await loadEtsyRoutes();
    } catch (err) {
      setEtsyError(
        err instanceof Error ? err.message : "Failed to update Etsy route",
      );
    }
  }

  async function handleChangePassword() {
    setChangingPassword(true);
    setPasswordMessage("");
    setPasswordError("");

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setPasswordMessage(data.message || "Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Failed to change password"
      );
    } finally {
      setChangingPassword(false);
    }
  }

  function handleExpireAllCodes() {
    const confirmed = window.confirm(
      "Are you sure you want to expire all unused access codes? This action cannot be undone."
    );
    if (confirmed) {
      alert("This feature is coming soon.");
    }
  }

  const pricingTiers = [
    {
      name: "Standard",
      price: "$24.99",
      description: "Basic invitation package",
    },
    {
      name: "Premium",
      price: "$34.99",
      description: "Enhanced invitation package",
    },
    {
      name: "Complete",
      price: "$49.99",
      description: "Full invitation suite",
    },
  ];

  const integrations = [
    { name: "Supabase", configured: true },
    { name: "Stripe", configured: true },
    { name: "Cloudflare R2", configured: true },
    { name: "Resend", configured: true },
    { name: "Prodigi", configured: true },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500 text-sm mt-1">
          Application configuration and integrations
        </p>
      </div>

      {/* Pricing Tiers */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Pricing Tiers</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className="border border-slate-200 rounded-lg p-5 bg-slate-50"
            >
              <p className="text-sm font-semibold text-slate-900">{tier.name}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {tier.price}
              </p>
              <p className="text-xs text-slate-500 mt-1">{tier.description}</p>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 rounded-b-xl">
          <p className="text-xs text-slate-500">
            Update pricing in your Stripe dashboard and environment variables.
          </p>
        </div>
      </section>

      {/* Admin Account */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Admin Account</h3>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-sm text-slate-600">
              <span className="font-medium">Email:</span>{" "}
              <span className="text-slate-900">{adminEmail || "N/A"}</span>
            </p>
          </div>

          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
            >
              Change Password
            </button>
          ) : (
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h4 className="text-sm font-medium text-slate-700">
                Change Password
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleChangePassword}
                  disabled={changingPassword || !currentPassword || !newPassword}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {changingPassword ? "Updating..." : "Update Password"}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setPasswordError("");
                    setPasswordMessage("");
                  }}
                  className="px-4 py-2 text-sm font-medium rounded-md text-slate-600 hover:text-slate-900 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {passwordMessage && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              {passwordMessage}
            </p>
          )}
          {passwordError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {passwordError}
            </p>
          )}
        </div>
      </section>

      {/* Access Code Settings */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">
            Access Code Settings
          </h3>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-slate-700">
            <span className="font-medium">Default expiration:</span>{" "}
            <span className="text-slate-900">90 days</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Access codes expire 90 days after generation. This is configured in the environment.
          </p>
        </div>
      </section>

      {/* Integration Status */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Integration Status</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Connection status for external services
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="px-6 py-3.5 flex items-center justify-between"
            >
              <p className="text-sm font-medium text-slate-900">
                {integration.name}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full ${
                    integration.configured ? "bg-green-500" : "bg-red-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    integration.configured
                      ? "text-green-700"
                      : "text-red-600"
                  }`}
                >
                  {integration.configured ? "Configured" : "Not Configured"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Etsy Listing Routes */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Etsy Listing Routes</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Route buyers to different Etsy listings by event type and package tier.
          </p>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Event Type
              </label>
              <input
                value={routeForm.eventType}
                onChange={(e) =>
                  setRouteForm((prev) => ({ ...prev, eventType: e.target.value }))
                }
                placeholder="wedding, anniversary, default"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Package Tier
              </label>
              <input
                value={routeForm.packageTier}
                onChange={(e) =>
                  setRouteForm((prev) => ({
                    ...prev,
                    packageTier: e.target.value,
                  }))
                }
                placeholder="standard, premium, complete, default"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Etsy Listing URL
              </label>
              <input
                value={routeForm.listingUrl}
                onChange={(e) =>
                  setRouteForm((prev) => ({ ...prev, listingUrl: e.target.value }))
                }
                placeholder="https://www.etsy.com/listing/..."
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Label
              </label>
              <input
                value={routeForm.listingLabel}
                onChange={(e) =>
                  setRouteForm((prev) => ({
                    ...prev,
                    listingLabel: e.target.value,
                  }))
                }
                placeholder="Wedding Premium Listing"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={routeForm.isActive}
                onChange={(e) =>
                  setRouteForm((prev) => ({ ...prev, isActive: e.target.checked }))
                }
              />
              Active route
            </label>

            <button
              onClick={handleSaveRoute}
              className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              {editingRouteId ? "Update Route" : "Add Route"}
            </button>
            {editingRouteId && (
              <button
                onClick={resetRouteForm}
                className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {etsyMessage && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              {etsyMessage}
            </p>
          )}
          {etsyError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {etsyError}
            </p>
          )}

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-3 py-2">Event</th>
                  <th className="text-left px-3 py-2">Tier</th>
                  <th className="text-left px-3 py-2">Label</th>
                  <th className="text-left px-3 py-2">URL</th>
                  <th className="text-left px-3 py-2">Status</th>
                  <th className="text-left px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingEtsyRoutes && (
                  <tr>
                    <td className="px-3 py-3 text-slate-500" colSpan={6}>
                      Loading routes...
                    </td>
                  </tr>
                )}
                {!loadingEtsyRoutes && etsyRoutes.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-slate-500" colSpan={6}>
                      No Etsy routes configured yet.
                    </td>
                  </tr>
                )}
                {etsyRoutes.map((route) => (
                  <tr key={route.id}>
                    <td className="px-3 py-2 font-medium text-slate-800">
                      {route.event_type}
                    </td>
                    <td className="px-3 py-2 text-slate-700">
                      {route.package_tier}
                    </td>
                    <td className="px-3 py-2 text-slate-700">
                      {route.listing_label}
                    </td>
                    <td className="px-3 py-2">
                      <a
                        href={route.listing_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 underline break-all"
                      >
                        {route.listing_url}
                      </a>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => void handleToggleRoute(route)}
                        className={`px-2 py-1 text-xs rounded ${
                          route.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {route.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-3 py-2 space-x-2">
                      <button
                        onClick={() => startEditRoute(route)}
                        className="text-xs text-slate-700 underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => void handleDeleteRoute(route.id)}
                        className="text-xs text-red-600 underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-white border-2 border-red-200 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-red-100">
          <h3 className="font-semibold text-red-700">Danger Zone</h3>
        </div>
        <div className="px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Expire All Unused Codes
              </p>
              <p className="text-xs text-slate-500">
                Mark all unused access codes as expired. This cannot be undone.
              </p>
            </div>
            <button
              onClick={handleExpireAllCodes}
              className="shrink-0 px-4 py-2 text-sm font-medium rounded-md border border-red-300 text-red-700 hover:bg-red-50 transition"
            >
              Expire All Unused Codes
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
