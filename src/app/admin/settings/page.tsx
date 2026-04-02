"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface IntegrationStatus {
  name: string;
  envVar: string;
  connected: boolean;
}

export default function AdminSettingsPage() {
  const [adminEmail, setAdminEmail] = useState("");

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Expire all codes state
  const [expireConfirm, setExpireConfirm] = useState(false);
  const [expiring, setExpiring] = useState(false);
  const [expireMessage, setExpireMessage] = useState("");

  // Integration statuses (checked client-side via a lightweight probe)
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [integrationsLoaded, setIntegrationsLoaded] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("admin_email") || "";
    setAdminEmail(email);

    // Check integrations by seeing which public env vars are set
    // For server-only vars, we infer from the admin API being functional
    const checks: IntegrationStatus[] = [
      {
        name: "Supabase",
        envVar: "NEXT_PUBLIC_SUPABASE_URL",
        connected: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      },
      {
        name: "Stripe",
        envVar: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        connected: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      },
      {
        name: "R2 Storage",
        envVar: "R2_*",
        connected: false, // Server-only, check via API
      },
      {
        name: "Resend Email",
        envVar: "RESEND_API_KEY",
        connected: false, // Server-only
      },
      {
        name: "Prodigi",
        envVar: "PRODIGI_API_KEY",
        connected: false, // Server-only
      },
    ];

    // If admin login worked, Supabase + JWT are connected
    const token = localStorage.getItem("admin_token");
    if (token) {
      checks[0].connected = true; // Supabase must work if we are authenticated
    }

    // Probe the admin stats endpoint to check if server integrations are configured
    if (token) {
      fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            // If stats work, core integrations are working
            checks[0].connected = true;
          }
        })
        .finally(() => {
          setIntegrations(checks);
          setIntegrationsLoaded(true);
        });
    } else {
      setIntegrations(checks);
      setIntegrationsLoaded(true);
    }
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

      setPasswordMessage(data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Failed to change password"
      );
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleExpireAllCodes() {
    setExpiring(true);
    setExpireMessage("");

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/codes", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed");

      // Note: In a real implementation, this would call a dedicated endpoint.
      // For now, display a confirmation message.
      setExpireMessage(
        "To expire all unused codes, a dedicated API endpoint would need to be created. This is a placeholder for that functionality."
      );
      setExpireConfirm(false);
    } catch {
      setExpireMessage("Failed to expire codes. Please try again.");
    } finally {
      setExpiring(false);
    }
  }

  const pricingTiers = [
    {
      name: "Digital Download",
      description: "PDF download only",
      price: "$0.00",
      note: "Included with access code",
    },
    {
      name: "Standard Print",
      description: "25 printed invitations",
      price: "$49.99",
      note: "Via Prodigi fulfillment",
    },
    {
      name: "Premium Print",
      description: "50 printed invitations + envelopes",
      price: "$89.99",
      note: "Via Prodigi fulfillment",
    },
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

      {/* Pricing */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Pricing</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Current pricing tiers (read-only; configured via environment
            variables)
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className="px-6 py-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {tier.name}
                </p>
                <p className="text-xs text-slate-500">{tier.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">
                  {tier.price}
                </p>
                <p className="text-xs text-slate-400">{tier.note}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 rounded-b-xl">
          <p className="text-xs text-slate-500">
            To update pricing, modify the environment variables in your hosting
            provider and redeploy.
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

          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h4 className="text-sm font-medium text-slate-700">
              Change Password
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <Button
              onClick={handleChangePassword}
              loading={changingPassword}
              disabled={!currentPassword || !newPassword}
              size="sm"
            >
              Update Password
            </Button>

            {passwordMessage && (
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                {passwordMessage}
              </p>
            )}
            {passwordError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {passwordError}
              </p>
            )}
          </div>
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
          <div className="flex items-center justify-between max-w-lg">
            <div>
              <p className="text-sm font-medium text-slate-700">
                Default Expiration Period
              </p>
              <p className="text-xs text-slate-500">
                How long an access code remains valid after generation
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">90 days</p>
              <p className="text-xs text-slate-400">Read-only</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 rounded-b-xl">
          <p className="text-xs text-slate-500">
            To change the expiration period, update the configuration in your
            environment variables.
          </p>
        </div>
      </section>

      {/* Integrations Status */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">
            Integrations Status
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Connection status for external services
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {!integrationsLoaded ? (
            <div className="px-6 py-8 text-center text-slate-400 text-sm">
              Checking integrations...
            </div>
          ) : (
            integrations.map((integration) => (
              <div
                key={integration.name}
                className="px-6 py-3.5 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {integration.name}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    {integration.envVar}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      integration.connected ? "bg-green-500" : "bg-red-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      integration.connected
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    {integration.connected ? "Connected" : "Not Configured"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 rounded-b-xl">
          <p className="text-xs text-slate-500">
            Server-only environment variables (R2, Resend, Prodigi) cannot be
            verified from the browser. Check your hosting provider to confirm
            they are set.
          </p>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-white border border-red-200 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-red-100">
          <h3 className="font-semibold text-red-700">Danger Zone</h3>
          <p className="text-xs text-red-500 mt-0.5">
            Irreversible actions -- proceed with caution
          </p>
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

            {!expireConfirm ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setExpireConfirm(true)}
                className="!border-red-300 !text-red-700 hover:!bg-red-50 shrink-0"
              >
                Expire All Unused Codes
              </Button>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={handleExpireAllCodes}
                  loading={expiring}
                  className="!bg-red-600 !border-red-600 !text-white hover:!bg-red-700"
                >
                  Confirm Expire All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpireConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {expireMessage && (
            <p className="mt-4 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              {expireMessage}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
