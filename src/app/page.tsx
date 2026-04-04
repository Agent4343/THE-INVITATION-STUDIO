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
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16 pt-10 sm:px-6">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 inline-flex rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-600">
              Updated Event-First Experience
            </p>
            <h1
              className="mb-3 text-4xl font-light tracking-tight text-stone-900 sm:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Design Event Stationery. Checkout on Etsy.
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-stone-600">
              Birthday, anniversary, shower, graduation, retirement, wedding, and
              more. Build your 9-piece set in minutes, then complete payment on Etsy.
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-stone-500">
              All event stationery files are supported here - not wedding-only templates.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-500">
              <span className="rounded-full bg-stone-100 px-3 py-1">No in-app payment processing</span>
              <span className="rounded-full bg-stone-100 px-3 py-1">Access code emailed after Etsy purchase</span>
              <span className="rounded-full bg-stone-100 px-3 py-1">Instant PDF export</span>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-4xl rounded-xl border border-stone-200 bg-stone-50 p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-3 text-left text-sm text-stone-600 sm:grid-cols-3">
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs uppercase tracking-wider text-stone-400">Step 1</p>
                <p className="mt-1 font-medium text-stone-700">Buy on Etsy</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs uppercase tracking-wider text-stone-400">Step 2</p>
                <p className="mt-1 font-medium text-stone-700">Receive your access code by email</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs uppercase tracking-wider text-stone-400">Step 3</p>
                <p className="mt-1 font-medium text-stone-700">Redeem code and customize your files</p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-7 flex max-w-md rounded-lg border border-stone-200 bg-white p-1">
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
            <div className="mx-auto mt-6 max-w-md rounded-xl border border-stone-200 bg-white p-5 text-center">
              <button
                type="button"
                onClick={handlePurchase}
                className="w-full rounded-lg bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-stone-700"
              >
                Continue to Etsy Checkout
              </button>
              <p className="mt-3 text-xs text-stone-500">
                Payments happen on Etsy only. This app is used for design customization and export.
              </p>
            </div>
          )}

          {tab === "code" && (
            <form onSubmit={handleCodeSubmit} className="mx-auto mt-6 max-w-md space-y-4 rounded-xl border border-stone-200 bg-white p-5">
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
            </form>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <h2 className="mb-6 text-center text-2xl font-light text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            9 Matching Pieces Included
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
            {SUITE_PIECES.map((piece) => (
              <div key={piece} className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-center text-xs text-stone-600">
                {piece}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Event Presets", "Switch quickly between birthday, anniversary, wedding, shower, graduation, retirement, and more."],
            ["Live Preview", "Every content change updates your stationery preview instantly."],
            ["AI Wording Help", "Generate polished wording suggestions for invitation, RSVP, details, and signs."],
            ["Print-Ready Export", "Download high-resolution PDFs for all suite pieces."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-xl border border-stone-200 bg-white p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-700">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">{desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-stone-200 py-7 text-center text-xs text-stone-500">
        <p className="font-medium text-stone-700">The Invitation Studio</p>
        <p className="mt-1">
          Support:{" "}
          <a href="mailto:support@theinvitationstudio.com" className="underline underline-offset-2 hover:text-stone-700">
            support@theinvitationstudio.com
          </a>
        </p>
        <p className="mt-1 text-[11px] text-stone-400">
          Etsy-only checkout · Access code by email · Event-first builder
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
