"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDesignStore } from "@/store/designStore";

export default function HomePage() {
  const router = useRouter();
  const { setDesignId, setToken } = useDesignStore();

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

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(formatCode(e.target.value));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
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

          {/* Access Code Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
          </form>
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
