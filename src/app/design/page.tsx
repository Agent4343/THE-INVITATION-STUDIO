"use client";

import React, { Suspense, useEffect, useRef, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDesignStore } from "@/store/designStore";
import { templates } from "@/data/templates";
import { palettes } from "@/data/palettes";
import { fonts } from "@/data/fonts";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import TemplateGrid from "@/components/builder/TemplateGrid";
import PaletteSelector from "@/components/builder/PaletteSelector";
import FontSelector from "@/components/builder/FontSelector";
import ContentForm from "@/components/builder/ContentForm";
import DownloadPanel from "@/components/builder/DownloadPanel";
import SuitePieces from "@/components/builder/SuitePieces";
import LivePreview from "@/components/builder/LivePreview";
import StepNavigator from "@/components/builder/StepNavigator";
import EtsyCheckoutPanel from "@/components/builder/EtsyCheckoutPanel";

function PrintOffer() {
  return (
    <div className="mt-6 rounded-lg border border-stone-200 bg-white p-5">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-stone-500">
        Want your stationery printed?
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-stone-500">
        Order professionally printed event stationery on premium paper,
        delivered to your door.
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

function DesignPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    setTemplate,
    setPalette,
    setFont,
    setContent,
    setDesignId,
    setToken,
    setSaving,
    setLastSavedAt,
  } = useDesignStore();

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedContentRef = useRef<string>("");
  const [authChecked, setAuthChecked] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [designLoaded, setDesignLoaded] = useState(false);

  // Handle ?code= query parameter: auto-validate and store auth
  useEffect(() => {
    const codeParam = searchParams.get("code");
    if (!codeParam) return;

    const storedToken = localStorage.getItem("token");
    if (storedToken) return; // Already authenticated

    (async () => {
      try {
        const res = await fetch("/api/auth/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeParam }),
        });

        const data = await res.json();
        if (res.ok && data.token && data.designId) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("designId", data.designId);
          setToken(data.token);
          setDesignId(data.designId);
        } else {
          router.push("/");
        }
      } catch {
        router.push("/");
      }
    })();
  }, [searchParams, router, setToken, setDesignId]);

  // Restore auth from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedDesignId = localStorage.getItem("designId");

    if (!storedToken || !storedDesignId) {
      // Only redirect if there's no ?code= param (handled above)
      if (!searchParams.get("code")) {
        router.push("/");
      }
      return;
    }

    if (!token) setToken(storedToken);
    if (!designId) setDesignId(storedDesignId);
    setAuthChecked(true);
  }, [router, token, designId, setToken, setDesignId, searchParams]);

  // Mark auth as checked once token and designId are in the store
  useEffect(() => {
    if (token && designId) {
      setAuthChecked(true);
    }
  }, [token, designId]);

  // Load saved design from server on mount
  useEffect(() => {
    if (!token || !designId || designLoaded) return;

    (async () => {
      try {
        const res = await fetch(`/api/design/load?designId=${designId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const { design } = await res.json();

        if (design.templateId) {
          const t = templates.find((tpl) => tpl.id === design.templateId);
          if (t) setTemplate(t);
        }
        if (design.paletteId) {
          const p = palettes.find((pal) => pal.id === design.paletteId);
          if (p) setPalette(p);
        }
        if (design.fontId) {
          const f = fonts.find((fnt) => fnt.id === design.fontId);
          if (f) setFont(f);
        }
        if (design.content && Object.keys(design.content).length > 0) {
          setContent(design.content);
        }

        // Set the initial saved content ref so we don't immediately re-save
        lastSavedContentRef.current = JSON.stringify({
          designId,
          templateId: design.templateId,
          paletteId: design.paletteId,
          fontId: design.fontId,
          content: design.content,
        });
      } catch {
        // Failed to load; continue with defaults
      } finally {
        setDesignLoaded(true);
      }
    })();
  }, [token, designId, designLoaded, setTemplate, setPalette, setFont, setContent]);

  // Auto-save with 10-second debounce
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
    setSaveError(null);
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
      } else {
        setSaveError("Failed to save. Will retry.");
      }
    } catch {
      setSaveError("Connection error. Will retry.");
    } finally {
      setSaving(false);
    }
  }, [designId, token, template, palette, font, content, setSaving, setLastSavedAt]);

  // Debounced auto-save (10s) with max delay (60s)
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(saveDesign, 10_000);

    // Start max delay timer if not already running
    if (!maxSaveTimerRef.current) {
      maxSaveTimerRef.current = setTimeout(() => {
        maxSaveTimerRef.current = null;
        saveDesign();
      }, 60_000);
    }

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [content, template, palette, font, saveDesign]);

  // Clear max delay timer when save completes
  useEffect(() => {
    if (lastSavedAt && maxSaveTimerRef.current) {
      clearTimeout(maxSaveTimerRef.current);
      maxSaveTimerRef.current = null;
    }
  }, [lastSavedAt]);

  // Save on beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!designId || !token) return;

      const payload = JSON.stringify({
        designId,
        templateId: template.id,
        paletteId: palette.id,
        fontId: font.id,
        content,
      });

      if (payload === lastSavedContentRef.current) return;

      // Use sendBeacon for reliable save on page close
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/design/save", blob);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [designId, token, template, palette, font, content]);

  // Cleanup max save timer on unmount
  useEffect(() => {
    return () => {
      if (maxSaveTimerRef.current) clearTimeout(maxSaveTimerRef.current);
    };
  }, []);

  // Show loading state while checking auth
  if (!authChecked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-stone-500">Loading your design...</p>
      </div>
    );
  }

  const stepPanel: Record<string, React.ReactNode> = {
    template: <TemplateGrid />,
    palette: <PaletteSelector />,
    font: <FontSelector />,
    content: <ContentForm />,
    preview: (
      <>
        <DownloadPanel />
        <EtsyCheckoutPanel />
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
          {saveError && (
            <span className="text-xs text-red-400">{saveError}</span>
          )}
          {isSaving && (
            <span className="text-xs text-stone-400">Saving...</span>
          )}
          {!isSaving && !saveError && lastSavedAt && (
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

export default function DesignPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-stone-50">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <DesignPageInner />
    </Suspense>
  );
}
