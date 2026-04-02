"use client";

import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const [adminEmail, setAdminEmail] = useState("");

  // Change password form
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("admin_email") || "";
    setAdminEmail(email);
  }, []);

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
