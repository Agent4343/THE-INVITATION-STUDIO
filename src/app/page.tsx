"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDesignStore } from "@/store/designStore";

type Tab = "code" | "purchase";

const TIERS = [
  {
    id: "standard" as const,
    name: "Standard",
    price: "$24.99",
    description: "Full wedding invitation suite builder",
    features: ["5 suite pieces", "4 elegant templates", "6 color palettes", "Unlimited downloads"],
  },
  {
    id: "premium" as const,
    name: "Premium",
    price: "$34.99",
    description: "Everything in Standard, plus extras",
    features: ["All Standard features", "Premium templates", "Priority support", "Extended access (1 year)"],
    popular: true,
  },
  {
    id: "complete" as const,
    name: "Complete",
    price: "$49.99",
    description: "The full experience",
    features: ["All Premium features", "All current & future templates", "Print discount included", "Lifetime access"],
  },
];

export default function HomePage() {
  const router = useRouter();
  const { setDesignId, setToken } = useDesignStore();

  const [tab, setTab] = useState<Tab>("purchase");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Purchase state
  const [email, setEmail] = useState("");
  const [selectedTier, setSelectedTier] = useState<"standard" | "premium" | "complete">("premium");
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const formatCode = (value: string) => {
    const digits = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 12);
    const parts: string[] = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join("-");
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(formatCode(e.target.value));
    setError(null);
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawCode = code.replace(/-/g, "");
    if (rawCode.length !== 12) {
      setError("Please enter a valid 12-character access code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid access code. Please try again.");
        return;
      }

      localStorage.setItem("designId", data.designId);
      localStorage.setItem("token", data.token);
      setDesignId(data.designId);
      setToken(data.token);
      router.push("/design");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setPurchaseError("Please enter a valid email address.");
      return;
    }

    setPurchaseLoading(true);
    setPurchaseError(null);

    try {
      const res = await fetch("/api/purchase/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tier: selectedTier }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPurchaseError(data.error || "Something went wrong. Please try again.");
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setPurchaseError("Something went wrong. Please try again.");
    } finally {
      setPurchaseLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      {/* Hero */}
      <main className="flex flex-1 flex-col items-center px-4 py-16">
        <div className="w-full max-w-3xl text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-stone-400">
            Welcome to
          </p>
          <h1
            className="mb-4 text-5xl font-semibold tracking-tight text-stone-800"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The Invitation Studio
          </h1>
          <p className="mb-12 text-lg text-stone-500">
            Design your perfect wedding invitation suite
          </p>

          {/* Tab Switcher */}
          <div className="mx-auto mb-8 flex max-w-md rounded-lg border border-stone-200 bg-white p-1">
            <button
              onClick={() => setTab("purchase")}
              className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === "purchase"
                  ? "bg-stone-800 text-white"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Get Started
            </button>
            <button
              onClick={() => setTab("code")}
              className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === "code"
                  ? "bg-stone-800 text-white"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              I Have a Code
            </button>
          </div>

          {/* Purchase Tab */}
          {tab === "purchase" && (
            <div className="mx-auto max-w-3xl">
              {/* Pricing Tiers */}
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`relative rounded-xl border-2 p-5 text-left transition-all ${
                      selectedTier === tier.id
                        ? "border-stone-800 bg-white shadow-md"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-2.5 right-4 rounded-full bg-stone-800 px-3 py-0.5 text-xs font-medium text-white">
                        Popular
                      </span>
                    )}
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-600">
                      {tier.name}
                    </h3>
                    <p
                      className="mt-1 text-3xl font-semibold text-stone-800"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {tier.price}
                    </p>
                    <p className="mt-1 text-xs text-stone-400">{tier.description}</p>
                    <ul className="mt-4 space-y-1.5">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start text-xs text-stone-500">
                          <svg className="mr-1.5 mt-0.5 h-3 w-3 flex-shrink-0 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              {/* Email + Purchase */}
              <form onSubmit={handlePurchase} className="mx-auto max-w-md space-y-4">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-600">
                    Your Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setPurchaseError(null); }}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-center text-stone-800 placeholder-stone-300 transition-colors focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200"
                    required
                  />
                </div>

                {purchaseError && (
                  <p className="text-sm text-red-500">{purchaseError}</p>
                )}

                <button
                  type="submit"
                  disabled={purchaseLoading}
                  className="w-full rounded-lg bg-stone-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {purchaseLoading ? "Redirecting to checkout..." : `Purchase — ${TIERS.find(t => t.id === selectedTier)?.price}`}
                </button>

                <p className="text-xs text-stone-400">
                  Secure payment via Stripe. You&apos;ll receive your access code instantly after purchase.
                </p>
              </form>
            </div>
          )}

          {/* Access Code Tab */}
          {tab === "code" && (
            <form onSubmit={handleCodeSubmit} className="mx-auto max-w-md space-y-4">
              <div>
                <label
                  htmlFor="access-code"
                  className="mb-2 block text-sm font-medium text-stone-600"
                >
                  Enter Your Access Code
                </label>
                <input
                  id="access-code"
                  type="text"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="XXXX-XXXX-XXXX"
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-center text-lg font-mono tracking-widest text-stone-800 placeholder-stone-300 transition-colors focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200"
                  maxLength={14}
                  autoComplete="off"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-stone-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Validating..." : "Start Designing"}
              </button>

              <p className="text-xs text-stone-400">
                Access codes are delivered via email after purchase or through Etsy.
              </p>
            </form>
          )}
        </div>

        {/* How It Works */}
        <div className="mt-24 w-full max-w-2xl">
          <h2
            className="mb-10 text-center text-2xl font-semibold text-stone-700"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How It Works
          </h2>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Choose Your Style",
                description:
                  "Browse elegant templates and color palettes curated for your special day.",
              },
              {
                step: "2",
                title: "Personalize Everything",
                description:
                  "Add your names, date, venue, and all the details that make it yours.",
              },
              {
                step: "3",
                title: "Download & Print",
                description:
                  "Get print-ready PDFs instantly, or order professionally printed cards.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-200 text-sm font-semibold text-stone-600">
                  {item.step}
                </span>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-stone-700">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-stone-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-8 text-center">
        <p className="text-sm text-stone-400">
          Need help?{" "}
          <a
            href="mailto:support@theinvitationstudio.com"
            className="text-stone-600 underline underline-offset-2 transition-colors hover:text-stone-800"
          >
            support@theinvitationstudio.com
          </a>
        </p>
      </footer>
    </div>
  );
}
