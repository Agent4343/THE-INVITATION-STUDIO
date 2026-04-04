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

interface EventStarterCopy {
  preHeading: string;
  invitationLine: string;
  welcomeMessage: string;
  name1: string;
  name2: string;
  date: string;
  time: string;
  venue: string;
  address: string;
}

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

function starterCopyForPreset(eventType: string): EventStarterCopy {
  switch (eventType) {
    case "birthday":
      return {
        preHeading: "Join us for a birthday celebration",
        invitationLine: "invite you to celebrate this birthday with us",
        welcomeMessage: "Welcome to the Birthday Celebration",
        name1: "Alex",
        name2: "Jordan",
        date: "Saturday, October 18, 2026",
        time: "6:00 PM",
        venue: "Celebration Hall",
        address: "123 Celebration Lane, Your City, ST",
      };
    case "anniversary":
      return {
        preHeading: "Together with our loved ones",
        invitationLine: "invite you to celebrate our anniversary",
        welcomeMessage: "Welcome to Our Anniversary Celebration",
        name1: "Alex",
        name2: "Jordan",
        date: "Saturday, October 18, 2026",
        time: "5:00 PM",
        venue: "Anniversary House",
        address: "456 Memory Lane, Your City, ST",
      };
    case "baby-shower":
      return {
        preHeading: "With joy in our hearts",
        invitationLine: "invite you to celebrate our growing family",
        welcomeMessage: "Welcome to the Baby Shower",
        name1: "Taylor",
        name2: "Morgan",
        date: "Sunday, October 19, 2026",
        time: "11:00 AM",
        venue: "Garden Room",
        address: "789 Blossom Street, Your City, ST",
      };
    case "bridal-shower":
      return {
        preHeading: "Hosted with love",
        invitationLine: "invite you to join the bridal shower celebration",
        welcomeMessage: "Welcome to the Bridal Shower",
        name1: "Taylor",
        name2: "Riley",
        date: "Saturday, October 18, 2026",
        time: "1:00 PM",
        venue: "Rosewood Lounge",
        address: "321 Rose Avenue, Your City, ST",
      };
    case "graduation":
      return {
        preHeading: "Please join us",
        invitationLine: "invite you to celebrate this graduation milestone",
        welcomeMessage: "Welcome to the Graduation Celebration",
        name1: "Jordan",
        name2: "Family & Friends",
        date: "Saturday, June 12, 2027",
        time: "2:00 PM",
        venue: "Main Auditorium",
        address: "200 University Way, Your City, ST",
      };
    case "retirement":
      return {
        preHeading: "Please join us",
        invitationLine: "invite you to celebrate a remarkable retirement",
        welcomeMessage: "Welcome to the Retirement Celebration",
        name1: "Alex",
        name2: "Colleagues & Friends",
        date: "Friday, September 10, 2027",
        time: "6:30 PM",
        venue: "Banquet Hall",
        address: "100 Heritage Drive, Your City, ST",
      };
    case "wedding":
      return {
        preHeading: "Hosted by friends and family",
        invitationLine: "invite you to celebrate with us",
        welcomeMessage: "Welcome to Our Celebration",
        name1: "Alex",
        name2: "Jordan",
        date: "Saturday, October 18, 2026",
        time: "4:30 PM",
        venue: "Celebration Hall",
        address: "123 Celebration Lane, Your City, ST",
      };
    default:
      return {
        preHeading: "Hosted by friends and family",
        invitationLine: "invite you to celebrate with us",
        welcomeMessage: "Welcome to Our Celebration",
        name1: "Alex",
        name2: "Jordan",
        date: "Saturday, October 18, 2026",
        time: "4:30 PM",
        venue: "Celebration Hall",
        address: "123 Celebration Lane, Your City, ST",
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
  if (name1 === "host name") normalized.name1 = "";
  if (name2 === "co-host name") normalized.name2 = "";

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
        Fulfillment policy
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-stone-500">
        Files are not delivered directly in-app. Final fulfillment is handled by
        admin through Etsy after purchase.
      </p>
      <button
        disabled
        className="w-full rounded-lg bg-stone-100 px-4 py-2.5 text-sm font-medium text-stone-400"
      >
        Managed through Etsy checkout
      </button>
    </div>
  );
}

function DesignPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forcePreviewMode = searchParams.get("mode") === "preview";
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
    resetDesign,
  } = useDesignStore();

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedContentRef = useRef<string>("");
  const seededPresetRef = useRef(false);
  const previewInitRef = useRef(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [designLoaded, setDesignLoaded] = useState(false);

  const activePreset = normalizeEventPreset(content.eventType);
  const isPreviewMode = forcePreviewMode || !token || !designId;

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
        "welcome to the birthday celebration",
        "welcome to our anniversary celebration",
        "welcome to the baby shower",
        "welcome to the bridal shower",
        "welcome to the graduation celebration",
        "welcome to the retirement celebration",
      ])
    ) {
      update.welcomeMessage = starter.welcomeMessage;
    }

    if (shouldReplaceField(content.name1, ["name one", "alex", "taylor", "jordan"])) {
      update.name1 = starter.name1;
    }
    if (shouldReplaceField(content.name2, ["name two", "jordan", "riley", "family & friends", "colleagues & friends"])) {
      update.name2 = starter.name2;
    }
    if (shouldReplaceField(content.date, ["your event date", "saturday, october 18, 2026", "saturday, june 12, 2027", "friday, september 10, 2027", "sunday, october 19, 2026"])) {
      update.date = starter.date;
    }
    if (shouldReplaceField(content.time, ["your event time", "4:30 pm", "5:00 pm", "6:00 pm", "1:00 pm", "2:00 pm", "6:30 pm", "11:00 am"])) {
      update.time = starter.time;
    }
    if (shouldReplaceField(content.venue, ["your event venue", "celebration hall", "anniversary house", "garden room", "rosewood lounge", "main auditorium", "banquet hall"])) {
      update.venue = starter.venue;
    }
    if (shouldReplaceField(content.address, ["your event location", "your event address", "123 celebration lane, your city, st", "456 memory lane, your city, st", "789 blossom street, your city, st", "321 rose avenue, your city, st", "200 university way, your city, st", "100 heritage drive, your city, st"])) {
      update.address = starter.address;
    }

    setContent(update);
  };

  // Handle ?code= query parameter: auto-validate and store auth
  useEffect(() => {
    if (forcePreviewMode) return;
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
  }, [searchParams, router, setToken, setDesignId, forcePreviewMode]);

  // Restore auth from localStorage on mount
  useEffect(() => {
    if (forcePreviewMode) {
      if (!previewInitRef.current) {
        resetDesign();
        previewInitRef.current = true;
      }
      localStorage.removeItem("token");
      localStorage.removeItem("designId");
      setAuthChecked(true);
      setDesignLoaded(true);
      return;
    }

    const storedToken = localStorage.getItem("token");
    const storedDesignId = localStorage.getItem("designId");

    if (!storedToken || !storedDesignId) {
      // Allow preview mode without purchase/auth to encourage design-first flow.
      setAuthChecked(true);
      setDesignLoaded(true);
      return;
    }

    if (!token) setToken(storedToken);
    if (!designId) setDesignId(storedDesignId);
    setAuthChecked(true);
  }, [token, designId, setToken, setDesignId, searchParams, forcePreviewMode, resetDesign]);

  // Mark auth as checked once token and designId are in the store
  useEffect(() => {
    if (token && designId) {
      setAuthChecked(true);
    }
  }, [token, designId]);

  // Seed visible event-specific starter copy once after load.
  useEffect(() => {
    if (!designLoaded || seededPresetRef.current) return;
    seededPresetRef.current = true;
    applyEventPreset(normalizeEventPreset(content.eventType));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designLoaded]);

  // Load saved design from server on mount
  useEffect(() => {
    if (!token || !designId || designLoaded) return;

    (async () => {
      try {
        const res = await fetch(`/api/design/load?designId=${designId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setLoadError(
            "We couldn't load your saved design. You can continue with starter content or retry.",
          );
          return;
        }

        const { design } = await res.json();
        setLoadError(null);

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
        setLoadError(
          "We couldn't load your saved design right now. Please check your connection and retry.",
        );
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
    if (!token || !designId) return;
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
  }, [content, template, palette, font, saveDesign, token, designId]);

  // Clear max delay timer when save completes
  useEffect(() => {
    if (lastSavedAt && maxSaveTimerRef.current) {
      clearTimeout(maxSaveTimerRef.current);
      maxSaveTimerRef.current = null;
    }
  }, [lastSavedAt]);

  // Save on beforeunload
  useEffect(() => {
    const sendKeepaliveSave = () => {
      if (!designId || !token) return;

      const payload = JSON.stringify({
        designId,
        templateId: template.id,
        paletteId: palette.id,
        fontId: font.id,
        content,
      });

      if (payload === lastSavedContentRef.current) return;

      void fetch("/api/design/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: payload,
        keepalive: true,
      }).catch(() => {
        // Ignore close-time failures.
      });
    };

    window.addEventListener("beforeunload", sendKeepaliveSave);
    window.addEventListener("pagehide", sendKeepaliveSave);
    return () => {
      window.removeEventListener("beforeunload", sendKeepaliveSave);
      window.removeEventListener("pagehide", sendKeepaliveSave);
    };
  }, [designId, token, template, palette, font, content]);

  const handleRetryLoad = useCallback(() => {
    if (!token || !designId) return;
    setLoadError(null);
    setDesignLoaded(false);
  }, [token, designId]);

  const handleFinalStepAction = useCallback(() => {
    const etsyPanel = document.getElementById("etsy-checkout-panel");
    if (etsyPanel) {
      etsyPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, []);

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
        <p className="mt-4 text-sm text-stone-500">Loading your event stationery...</p>
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
        <div id="etsy-checkout-panel">
          <EtsyCheckoutPanel />
        </div>
        <PrintOffer />
      </>
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-stone-50 to-white">
      <header className="border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1
              className="text-xl font-semibold text-stone-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              The Invitation Studio
            </h1>
            <p className="text-xs text-stone-500">
              All-event stationery builder
            </p>
          </div>
          <div className="flex items-center gap-3">
            {saveError && (
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs text-red-500">
                {saveError}
              </span>
            )}
            {isSaving && (
              <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-500">
                Saving...
              </span>
            )}
            {!isSaving && !saveError && lastSavedAt && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">
                Saved{" "}
                {new Date(lastSavedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-8 pt-5 sm:px-6">
        {isPreviewMode && (
          <section className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Preview mode is active. You can design everything before purchase.
            File copies are locked until you complete Etsy checkout and admin fulfills the order.
          </section>
        )}
        {loadError && (
          <section className="mb-4 flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
            <p>{loadError}</p>
            <button
              type="button"
              onClick={handleRetryLoad}
              className="inline-flex w-fit rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
            >
              Retry load
            </button>
          </section>
        )}
        <section className="mb-4 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
              Event Preset
            </p>
            <p className="text-xs text-stone-500">
              Choose the event type to auto-fill better starter content.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {EVENT_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => applyEventPreset(preset.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  activePreset === preset.value
                    ? "bg-stone-900 text-white"
                    : "border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[420px_1fr]">
          <div className="flex min-h-[70vh] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="flex-1 overflow-y-auto p-5">{stepPanel[currentStep]}</div>
            <div className="border-t border-stone-200 bg-stone-50 p-5">
              <StepNavigator onFinalAction={handleFinalStepAction} />
            </div>
          </div>

          <div className="flex min-h-[70vh] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="border-b border-stone-200 bg-stone-50 p-4">
              <SuitePieces />
            </div>
            <div className="flex flex-1 items-start justify-center overflow-y-auto p-5 sm:p-7">
              <LivePreview />
            </div>
          </div>
        </section>
      </main>
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
