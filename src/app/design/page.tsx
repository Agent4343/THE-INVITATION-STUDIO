"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDesignStore } from "@/store/designStore";
import TemplateGrid from "@/components/builder/TemplateGrid";
import PaletteSelector from "@/components/builder/PaletteSelector";
import FontSelector from "@/components/builder/FontSelector";
import ContentForm from "@/components/builder/ContentForm";
import DownloadPanel from "@/components/builder/DownloadPanel";
import SuitePieces from "@/components/builder/SuitePieces";
import LivePreview from "@/components/builder/LivePreview";
import StepNavigator from "@/components/builder/StepNavigator";

function PrintOffer() {
  return (
    <div className="mt-6 rounded-lg border border-stone-200 bg-white p-5">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-stone-500">
        Want it printed?
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-stone-500">
        Order professionally printed cards on premium paper, delivered to your
        door.
      </p>
      <button
        disabled
        className="w-full rounded-lg bg-stone-100 px-4 py-2.5 text-sm font-medium text-stone-400"
      >
        Print ordering coming soon
      </button>
    </div>
  );
}

export default function DesignPage() {
  const router = useRouter();
  const {
    currentStep,
    designId,
    token,
    content,
    template,
    palette,
    font,
    isSaving,
    lastSavedAt,
    setDesignId,
    setToken,
    setSaving,
    setLastSavedAt,
  } = useDesignStore();

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedContentRef = useRef<string>("");

  // Restore auth from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedDesignId = localStorage.getItem("designId");

    if (!storedToken || !storedDesignId) {
      router.push("/");
      return;
    }

    if (!token) setToken(storedToken);
    if (!designId) setDesignId(storedDesignId);
  }, [router, token, designId, setToken, setDesignId]);

  // Auto-save with 30-second debounce
  const saveDesign = useCallback(async () => {
    if (!designId || !token) return;

    const payload = JSON.stringify({
      designId,
      templateId: template.id,
      paletteId: palette.id,
      fontId: font.id,
      content,
    });

    if (payload === lastSavedContentRef.current) return;

    setSaving(true);
    try {
      const res = await fetch("/api/design/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (res.ok) {
        lastSavedContentRef.current = payload;
        setLastSavedAt(new Date().toISOString());
      }
    } catch {
      // Silently fail; user can retry
    } finally {
      setSaving(false);
    }
  }, [designId, token, template, palette, font, content, setSaving, setLastSavedAt]);

  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(saveDesign, 30_000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [content, template, palette, font, saveDesign]);

  // Don't render builder until auth is confirmed
  if (!token && typeof window !== "undefined" && !localStorage.getItem("token")) {
    return null;
  }

  const stepPanel: Record<string, React.ReactNode> = {
    template: <TemplateGrid />,
    palette: <PaletteSelector />,
    font: <FontSelector />,
    content: <ContentForm />,
    preview: (
      <>
        <DownloadPanel />
        <PrintOffer />
      </>
    ),
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-stone-200 px-6 py-3">
        <h1
          className="text-xl font-semibold text-stone-800"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          The Invitation Studio
        </h1>
        <div className="flex items-center gap-3">
          {isSaving && (
            <span className="text-xs text-stone-400">Saving...</span>
          )}
          {!isSaving && lastSavedAt && (
            <span className="text-xs text-stone-400">
              Saved{" "}
              {new Date(lastSavedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left panel - Controls */}
        <div className="flex w-full flex-col border-b border-stone-200 lg:w-2/5 lg:border-b-0 lg:border-r">
          <div className="flex-1 overflow-y-auto p-6">
            {stepPanel[currentStep]}
          </div>

          <div className="border-t border-stone-200 p-6">
            <StepNavigator />
          </div>
        </div>

        {/* Right panel - Preview */}
        <div className="flex w-full flex-1 flex-col lg:w-3/5">
          <div className="border-b border-stone-200 p-4">
            <SuitePieces />
          </div>

          <div className="flex flex-1 items-start justify-center overflow-y-auto p-6">
            <LivePreview />
          </div>
        </div>
      </div>
    </div>
  );
}
