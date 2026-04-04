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

const EVENT_TYPES = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Baby Shower",
  "Bridal Shower",
  "Graduation",
  "Retirement",
  "Holiday",
  "Corporate Event",
];

function HomePageInner() {
  const ETSY_SHOP_URL =
    process.env.NEXT_PUBLIC_ETSY_SHOP_URL ||
    "https://www.etsy.com/shop/theinvitationstudio";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setDesignId, setToken, resetDesign } = useDesignStore();

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

  const handlePreviewBuilder = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("designId");
    resetDesign();
    router.push("/design?mode=preview");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-stone-50 to-white">
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm sm:p-10">
            <p className="mb-4 inline-flex rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-600">
              All-Events Studio
            </p>
            <h1
              className="text-4xl font-light leading-tight tracking-tight text-stone-900 sm:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Create complete event stationery files for every celebration.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600">
              This app supports all event file types - birthday, anniversary,
              wedding, baby shower, graduation, retirement, and more. Build your
              full 9-piece set here, then complete payment on Etsy.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 text-sm text-stone-600 sm:grid-cols-3">
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                <p className="text-xs uppercase tracking-wider text-stone-400">Step 1</p>
                <p className="mt-1 font-medium text-stone-700">Purchase access on Etsy</p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                <p className="text-xs uppercase tracking-wider text-stone-400">Step 2</p>
                <p className="mt-1 font-medium text-stone-700">Receive code by email</p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                <p className="text-xs uppercase tracking-wider text-stone-400">Step 3</p>
                <p className="mt-1 font-medium text-stone-700">Redeem and prepare Etsy order details</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-stone-500">
              <span className="rounded-full bg-stone-100 px-3 py-1">Etsy-only checkout</span>
              <span className="rounded-full bg-stone-100 px-3 py-1">No in-app payment processing</span>
              <span className="rounded-full bg-stone-100 px-3 py-1">Files delivered by Etsy after purchase</span>
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex rounded-lg border border-stone-200 bg-stone-50 p-1">
              <button
                onClick={() => setTab("purchase")}
                className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                  tab === "purchase"
                    ? "bg-stone-800 text-white"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                Buy on Etsy
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

            {tab === "purchase" && (
              <div className="mt-5 space-y-3">
                <h2 className="text-lg font-semibold text-stone-800">Checkout handled on Etsy</h2>
                <p className="text-sm leading-relaxed text-stone-600">
                  Purchase your event stationery access through Etsy. After payment,
                  your redemption code is emailed to you.
                </p>
                <button
                  type="button"
                  onClick={handlePurchase}
                  className="w-full rounded-lg bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-stone-700"
                >
                  Continue to Etsy Checkout
                </button>
                <button
                  type="button"
                  onClick={handlePreviewBuilder}
                  className="w-full rounded-lg border border-stone-300 bg-white px-6 py-3.5 text-sm font-semibold text-stone-700 transition-all hover:bg-stone-50"
                >
                  Preview Builder First (No Purchase Yet)
                </button>
              </div>
            )}

            {tab === "code" && (
              <form onSubmit={handleCodeSubmit} className="mt-5 space-y-4">
                <div>
                  <label htmlFor="access-code" className="mb-2 block text-sm font-medium text-stone-600">
                    Enter your access code
                  </label>
                  <input
                    id="access-code"
                    type="text"
                    value={code}
                    onChange={handleCodeChange}
                    placeholder="XXXX-XXXX-XXXX"
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3.5 text-center text-lg font-mono tracking-widest text-stone-800 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200"
                    maxLength={14}
                    autoComplete="off"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Validating..." : "Open Event Builder"}
                </button>
                <p className="text-xs text-stone-500">
                  All event types are supported in the builder. Final files are
                  purchased and delivered through Etsy.
                </p>
              </form>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h2
            className="text-center text-2xl font-light text-stone-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Built for all event file types
          </h2>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {EVENT_TYPES.map((event) => (
              <span
                key={event}
                className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-600"
              >
                {event}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h2
            className="mb-6 text-center text-2xl font-light text-stone-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            9 Matching Files Included
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
            {SUITE_PIECES.map((piece) => (
              <div
                key={piece}
                className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-center text-xs font-medium text-stone-600"
              >
                {piece}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white py-7 text-center text-xs text-stone-500">
        <p className="font-medium text-stone-700">The Invitation Studio</p>
        <p className="mt-1">
          Support:{" "}
          <a
            href="mailto:support@theinvitationstudio.com"
            className="underline underline-offset-2 hover:text-stone-700"
          >
            support@theinvitationstudio.com
          </a>
        </p>
        <p className="mt-1 text-[11px] text-stone-400">
          Etsy-only checkout · Access code by email · All-event builder
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
