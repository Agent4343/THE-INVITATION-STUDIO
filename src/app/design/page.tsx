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

const EVENT_PRESETS = [
  { value: "celebration", label: "General" },
  { value: "birthday", label: "Birthday" },
  { value: "anniversary", label: "Anniversary" },
  { value: "baby-shower", label: "Baby Shower" },
  { value: "bridal-shower", label: "Bridal Shower" },
  { value: "graduation", label: "Graduation" },
  { value: "retirement", label: "Retirement" },
  { value: "wedding", label: "Wedding" },
] as const;

function normalizeEventPreset(value?: string): string {
  const v = (value || "").trim().toLowerCase();
  if (v.includes("birthday")) return "birthday";
  if (v.includes("anniversary") || v.includes("vow-renewal")) return "anniversary";
  if (v.includes("baby-shower")) return "baby-shower";
  if (v.includes("bridal-shower")) return "bridal-shower";
  if (v.includes("graduation")) return "graduation";
  if (v.includes("retirement")) return "retirement";
  if (v.includes("wedding") || v.includes("elopement") || v.includes("civil-ceremony")) return "wedding";
  return "celebration";
}

function shouldReplaceField(current: unknown, allowList: string[]): boolean {
  const value = String(current || "").trim().toLowerCase();
  return value === "" || allowList.includes(value);
}

function starterCopyForPreset(eventType: string) {
  switch (eventType) {
    case "birthday":
      return {
        preHeading: "Join us for a birthday celebration",
        invitationLine: "invite you to celebrate this birthday with us",
        welcomeMessage: "Welcome to the Birthday Celebration",
      };
    case "anniversary":
      return {
        preHeading: "Together with our loved ones",
        invitationLine: "invite you to celebrate our anniversary",
        welcomeMessage: "Welcome to Our Anniversary Celebration",
      };
    case "baby-shower":
      return {
        preHeading: "With joy in our hearts",
        invitationLine: "invite you to celebrate our growing family",
        welcomeMessage: "Welcome to the Baby Shower",
      };
    case "bridal-shower":
      return {
        preHeading: "Hosted with love",
        invitationLine: "invite you to join the bridal shower celebration",
        welcomeMessage: "Welcome to the Bridal Shower",
      };
    case "graduation":
      return {
        preHeading: "Please join us",
        invitationLine: "invite you to celebrate this graduation milestone",
        welcomeMessage: "Welcome to the Graduation Celebration",
      };
    case "retirement":
      return {
        preHeading: "Please join us",
        invitationLine: "invite you to celebrate a remarkable retirement",
        welcomeMessage: "Welcome to the Retirement Celebration",
      };
    case "wedding":
      return {
        preHeading: "Hosted by friends and family",
        invitationLine: "invite you to celebrate with us",
        welcomeMessage: "Welcome to Our Celebration",
      };
    default:
      return {
        preHeading: "Hosted by friends and family",
        invitationLine: "invite you to celebrate with us",
        welcomeMessage: "Welcome to Our Celebration",
      };
  }
}

function normalizeLegacyEventCopy(content: Record<string, unknown>) {
  const normalized = { ...content };

  const preHeading = typeof normalized.preHeading === "string"
    ? normalized.preHeading.trim().toLowerCase()
    : "";
  if (preHeading === "together with their families") {
    normalized.preHeading = "Hosted by friends and family";
  }
  if (preHeading === "hosted by their loved ones") {
    normalized.preHeading = "Hosted by friends and family";
  }

  const invitationLine = typeof normalized.invitationLine === "string"
    ? normalized.invitationLine.trim().toLowerCase()
    : "";
  if (invitationLine === "invite you to celebrate their marriage") {
    normalized.invitationLine = "invite you to celebrate with us";
  }

  const name1 = typeof normalized.name1 === "string" ? normalized.name1.trim().toLowerCase() : "";
  const name2 = typeof normalized.name2 === "string" ? normalized.name2.trim().toLowerCase() : "";
  if (name1 === "emma rose") normalized.name1 = "";
  if (name2 === "james william") normalized.name2 = "";
  if (name1 === "name one") normalized.name1 = "";
  if (name2 === "name two") normalized.name2 = "";

  const venue = typeof normalized.venue === "string" ? normalized.venue.trim().toLowerCase() : "";
  if (venue === "the grand estate") normalized.venue = "";
  if (venue === "your event venue") normalized.venue = "";

  const address = typeof normalized.address === "string" ? normalized.address.trim().toLowerCase() : "";
  if (address === "123 garden lane, napa valley, california") normalized.address = "";
  if (address === "your event location" || address === "your event address") {
    normalized.address = "";
  }

  const time = typeof normalized.time === "string" ? normalized.time.trim().toLowerCase() : "";
  if (time === "half past four in the afternoon") normalized.time = "";
  if (time === "your event time") normalized.time = "";

  const date = typeof normalized.date === "string" ? normalized.date.trim().toLowerCase() : "";
  if (date === "your event date") normalized.date = "";

  return normalized;
}

function PrintOffer() {
  return (
    <div className="mt-6 rounded-lg border border-stone-200 bg-white p-5">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-stone-500">
        Want event stationery printed?
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

  const activePreset = normalizeEventPreset(content.eventType);

  const applyEventPreset = (eventType: string) => {
    const starter = starterCopyForPreset(eventType);
    const update: Record<string, string> = { eventType };

    if (
      shouldReplaceField(content.preHeading, [
        "hosted by their loved ones",
        "hosted by friends and family",
        "together with their families",
      ])
    ) {
      update.preHeading = starter.preHeading;
    }

    if (
      shouldReplaceField(content.invitationLine, [
        "invite you to celebrate with us",
        "invite you to celebrate their marriage",
      ])
    ) {
      update.invitationLine = starter.invitationLine;
    }

    if (
      shouldReplaceField(content.welcomeMessage, [
        "welcome to our celebration",
        "welcome to the celebration of",
        "welcome to our wedding",
      ])
    ) {
      update.welcomeMessage = starter.welcomeMessage;
    }

    setContent(update);
  };

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
          setContent(
            normalizeLegacyEventCopy(
              design.content as unknown as Record<string, unknown>,
            ),
          );
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
      <div className="border-b border-stone-200 bg-white px-6 py-3">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
          Event Type Preset
        </p>
        <div className="flex flex-wrap gap-2">
          {EVENT_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => applyEventPreset(preset.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activePreset === preset.value
                  ? "bg-stone-800 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

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
