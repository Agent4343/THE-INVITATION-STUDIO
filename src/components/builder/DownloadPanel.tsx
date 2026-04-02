"use client";

import React, { useState } from "react";
import { useDesignStore } from "@/store/designStore";
import Button from "@/components/ui/Button";

export default function DownloadPanel() {
  const { designId, token, isGeneratingPdf, setGeneratingPdf } =
    useDesignStore();
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!designId) {
      setError("Please save your design before downloading.");
      return;
    }

    setError(null);
    setGeneratingPdf(true);

    try {
      const res = await fetch("/api/design/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ designId }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate PDF. Please try again.");
      }

      const data = await res.json();
      const url: string = data.url;

      const a = document.createElement("a");
      a.href = url;
      a.download = "wedding-suite.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-500">
        Download
      </h3>

      <Button
        onClick={handleDownload}
        loading={isGeneratingPdf}
        size="lg"
        className="w-full"
      >
        {isGeneratingPdf ? "Generating PDF..." : "Download Full Suite"}
      </Button>

      {error && (
        <p className="text-center text-sm text-red-500">{error}</p>
      )}

      <div className="pt-2">
        <p className="mb-2 text-xs font-medium text-stone-400">
          Individual pieces
        </p>
        <div className="flex flex-wrap gap-2">
          {["Invitation", "RSVP", "Details", "Menu", "Thank You"].map(
            (piece) => (
              <Button
                key={piece}
                variant="ghost"
                size="sm"
                disabled
                className="text-xs"
              >
                {piece}
              </Button>
            )
          )}
        </div>
        <p className="mt-1 text-xs text-stone-400">
          Individual downloads coming soon.
        </p>
      </div>
    </div>
  );
}
