"use client";

import React, { useState } from "react";
import { useDesignStore } from "@/store/designStore";

interface AISuggestButtonProps {
  field: string;
  onSelect: (value: string) => void;
}

export default function AISuggestButton({ field, onSelect }: AISuggestButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tone, setTone] = useState<string>("romantic");
  const { content, token } = useDesignStore();

  const tones = [
    { id: "formal", label: "Formal" },
    { id: "romantic", label: "Romantic" },
    { id: "modern", label: "Modern" },
    { id: "playful", label: "Playful" },
    { id: "rustic", label: "Rustic" },
  ];

  const fetchSuggestions = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const res = await fetch("/api/ai/suggest-wording", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          field,
          context: {
            name1: content.name1,
            name2: content.name2,
            date: content.date,
            time: content.time,
            venue: content.venue,
          },
          tone,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to get suggestions");
      }

      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    fetchSuggestions();
  };

  const handleSelect = (suggestion: string) => {
    onSelect(suggestion);
    setIsOpen(false);
    setSuggestions([]);
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleOpen}
        className="ml-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 px-2.5 py-1 text-[10px] font-medium text-white shadow-sm transition-all hover:from-violet-600 hover:to-purple-600 hover:shadow-md"
        title="AI Wording Suggestions"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
        </svg>
        AI
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-lg border border-stone-200 bg-white p-3 shadow-xl">
            {/* Tone selector */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {tones.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTone(t.id);
                    // Re-fetch with new tone
                    setTimeout(() => fetchSuggestions(), 0);
                  }}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                    tone === t.id
                      ? "bg-stone-800 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-6">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-stone-300 border-t-violet-500" />
                <span className="ml-2 text-xs text-stone-500">Generating suggestions...</span>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="rounded-md bg-red-50 p-2 text-xs text-red-600">
                {error}
              </div>
            )}

            {/* Suggestions */}
            {!loading && suggestions.length > 0 && (
              <div className="space-y-1.5">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelect(s)}
                    className="w-full rounded-md border border-stone-100 p-2.5 text-left text-xs leading-relaxed text-stone-700 transition-colors hover:border-violet-200 hover:bg-violet-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Regenerate button */}
            {!loading && suggestions.length > 0 && (
              <button
                type="button"
                onClick={fetchSuggestions}
                className="mt-2 w-full rounded-md bg-stone-50 py-1.5 text-[11px] text-stone-500 transition-colors hover:bg-stone-100"
              >
                Regenerate
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
