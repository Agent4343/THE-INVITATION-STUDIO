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
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate PDF. Please try again.");
      }

      // Response is HTML — open in new window for print-to-PDF
      const html = await res.text();
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Please allow popups to download your suite.");
      }

      printWindow.document.write(html);
      printWindow.document.close();

      // Wait for content and fonts to load, then trigger print dialog
      setTimeout(() => {
        try {
          printWindow.print();
        } catch {
          // Window may have been closed
        }
      }, 1500);
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
        {isGeneratingPdf ? "Preparing your suite..." : "Download Full Suite"}
      </Button>

      {error && (
        <p className="text-center text-sm text-red-500">{error}</p>
      )}

      <p className="text-xs text-stone-400 text-center">
        Opens a print preview — choose &quot;Save as PDF&quot; to download your print-ready invitation suite.
      </p>

    </div>
  );
}
