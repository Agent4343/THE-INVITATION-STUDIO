"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDesignStore } from "@/store/designStore";

type Tab = "code" | "purchase";

const SUITE_PIECES = [
  "Main Invitation",
  "RSVP Card",
  "Details Card",
  "Dinner Menu",
  "Thank You Card",
  "Save the Date",
  "Table Numbers",
  "Place Cards",
  "Welcome Sign",
];

function HomePageInner() {
  const ETSY_SHOP_URL =
    process.env.NEXT_PUBLIC_ETSY_SHOP_URL ||
    "https://www.etsy.com/shop/theinvitationstudio";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setDesignId, setToken } = useDesignStore();

  const [tab, setTab] = useState<Tab>("purchase");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatCode = (value: string) => {
    const digits = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 12);
    const parts: string[] = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join("-");
  };

  useEffect(() => {
    const codeParam = searchParams.get("code");
    if (codeParam) {
      setTab("code");
      setCode(formatCode(codeParam));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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

  const handlePurchase = () => {
    window.open(ETSY_SHOP_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center px-4">
        <section className="w-full max-w-4xl py-16 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.4em] text-stone-400">
            Event Stationery for Every Style
          </p>
          <h1
            className="mb-4 text-5xl font-light tracking-tight text-stone-800 sm:text-6xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The Invitation Studio
          </h1>
          <p className="mx-auto mb-4 max-w-xl text-base leading-relaxed text-stone-500">
            Create a cohesive 9-piece suite without hiring a designer.
            Weddings, elopements, anniversaries, showers, birthdays, and more
            — personalized for your style and guests.
          </p>
          <p className="mb-12 text-sm text-stone-400">
            1,728 combinations &middot; AI wording help &middot; Instant PDF downloads
          </p>

          <div className="mx-auto mb-8 grid max-w-3xl grid-cols-1 gap-2 rounded-lg border border-stone-200 bg-white p-4 text-xs text-stone-500 sm:grid-cols-3">
            <p>Etsy-compliant final checkout</p>
            <p>Access code delivered by email</p>
            <p>Friendly support: support@theinvitationstudio.com</p>
          </div>

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
              Buy Access
            </button>
            <button
              onClick={() => setTab("code")}
              className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === "code"
                  ? "bg-stone-800 text-white"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Redeem Code
            </button>
          </div>

          {/* Purchase Tab */}
          {tab === "purchase" && (
            <div className="mx-auto max-w-xl">
              <div className="mx-auto max-w-md space-y-4">
                <button
                  type="button"
                  onClick={handlePurchase}
                  className="w-full rounded-lg bg-stone-800 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-stone-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Buy on Etsy
                </button>

                <p className="text-xs text-stone-500">
                  All payments are completed on Etsy. This app does not process
                  payments directly.
                </p>
                <p className="text-xs text-stone-400">
                  After Etsy checkout, you receive an access code by email to
                  redeem here and start designing.
                </p>
              </div>
            </div>
          )}

          {/* Access Code Tab */}
          {tab === "code" && (
            <form onSubmit={handleCodeSubmit} className="mx-auto max-w-md space-y-4">
              <div>
                <label htmlFor="access-code" className="mb-2 block text-sm font-medium text-stone-600">
                  Enter Your Access Code
                </label>
                <input
                  id="access-code"
                  type="text"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="XXXX-XXXX-XXXX"
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3.5 text-center text-lg font-mono tracking-widest text-stone-800 placeholder-stone-300 transition-colors focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200"
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
                className="w-full rounded-lg bg-stone-800 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-stone-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Validating..." : "Start Designing"}
              </button>

              <p className="text-xs text-stone-400">
                Access code format: XXXX-XXXX-XXXX. Delivered by email after
                purchase.
              </p>
            </form>
          )}
        </section>

        {/* What's Included Section */}
        <section className="w-full max-w-4xl border-t border-stone-200 py-16">
          <h2
            className="mb-3 text-center text-2xl font-light text-stone-800"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Complete 9-Piece Suite
          </h2>
          <p className="mb-10 text-center text-sm text-stone-400">
            Everything you need for a cohesive, beautiful event
          </p>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
            {SUITE_PIECES.map((piece) => (
              <div key={piece} className="flex flex-col items-center text-center">
                <div
                  className="mb-2 flex h-14 w-10 items-center justify-center rounded border"
                  style={{
                    backgroundColor: "#FAF8F5",
                    borderColor: "#E0DAD0",
                  }}
                >
                  <div className="space-y-0.5">
                    <div className="mx-auto h-[1px] w-4 rounded-full bg-stone-300" />
                    <div className="mx-auto h-[1px] w-3 rounded-full bg-stone-200" />
                    <div className="mx-auto h-[1px] w-4 rounded-full bg-stone-200" />
                  </div>
                </div>
                <span className="text-[10px] leading-tight text-stone-500">{piece}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full max-w-4xl border-t border-stone-200 py-16">
          <h2
            className="mb-10 text-center text-2xl font-light text-stone-800"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Designed to Delight
          </h2>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "12 Designer Templates",
                desc: "From Classic Elegance to Art Deco Luxe, Botanical Bliss to Coastal Breeze. Each with unique decorative elements.",
              },
              {
                title: "12 Color Palettes",
                desc: "Sage & Gold, Dusty Rose, Midnight & Pearl, Terracotta Sunset — curated palettes for every event style.",
              },
              {
                title: "12 Premium Fonts",
                desc: "Playfair Display, Great Vibes, Cinzel, Tangerine — beautiful typography pairings from Google Fonts.",
              },
              {
                title: "AI Wording Assistant",
                desc: "Powered by Claude AI. Get elegant wording suggestions for every section with 5 tone options.",
              },
              {
                title: "Live Preview",
                desc: "See your changes in real-time. Every edit updates the preview instantly — what you see is what you print.",
              },
              {
                title: "Print-Ready Downloads",
                desc: "High-resolution PDF output with proper margins, bleed, and color accuracy for professional printing.",
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-stone-700">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-stone-500">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full max-w-3xl border-t border-stone-200 py-16">
          <h2
            className="mb-10 text-center text-2xl font-light text-stone-800"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How It Works
          </h2>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Pick Your Template",
                desc: "Choose from designer-made styles curated for modern, romantic, and classic events.",
              },
              {
                step: "02",
                title: "Personalize in Minutes",
                desc: "Add your details, tune fonts and palettes, and use AI for polished wording.",
              },
              {
                step: "03",
                title: "Download or Print",
                desc: "Export print-ready PDFs instantly or order professionally printed sets.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span
                  className="mb-3 inline-block text-3xl font-light text-stone-300"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.step}
                </span>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-stone-700">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-stone-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-8 text-center">
        <p
          className="mb-2 text-lg text-stone-300"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          The Invitation Studio
        </p>
        <p className="text-xs text-stone-400">
          Need help?{" "}
          <a
            href="mailto:support@theinvitationstudio.com"
            className="text-stone-500 underline underline-offset-2 transition-colors hover:text-stone-700"
          >
            support@theinvitationstudio.com
          </a>
        </p>
        <p className="mt-2 text-[11px] text-stone-400">
          Etsy-compliant final checkout &middot; Access code sent to your email after purchase
        </p>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomePageInner />
    </Suspense>
  );
}
