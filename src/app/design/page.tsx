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
  { value: "engagement", label: "Engagement" },
  { value: "vow-renewal", label: "Vow Renewal" },
  { value: "baby-shower", label: "Baby Shower" },
  { value: "bridal-shower", label: "Bridal Shower" },
  { value: "graduation", label: "Graduation" },
  { value: "retirement", label: "Retirement" },
  { value: "holiday-party", label: "Holiday Party" },
  { value: "corporate-event", label: "Corporate Event" },
  { value: "elopement", label: "Elopement" },
  { value: "civil-ceremony", label: "Civil Ceremony" },
  { value: "wedding", label: "Wedding" },
] as const;

interface EventStarterCopy {
  preHeading: string;
  invitationLine: string;
  welcomeMessage: string;
  welcomeSubtext: string;
  name1: string;
  name2: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  ceremonyDetails: string;
  receptionDetails: string;
  dressCode: string;
  saveTheDateMessage: string;
  thankYouMessage: string;
}

function normalizeEventPreset(value?: string): string {
  const v = (value || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
  if (v.includes("birthday")) return "birthday";
  if (v.includes("vow-renewal") || (v.includes("vow") && v.includes("renew"))) return "vow-renewal";
  if (v.includes("anniversary")) return "anniversary";
  if (v.includes("engagement")) return "engagement";
  if ((v.includes("baby") && v.includes("shower")) || v.includes("baby-shower")) return "baby-shower";
  if ((v.includes("bridal") && v.includes("shower")) || v.includes("bridal-shower")) return "bridal-shower";
  if (v.includes("graduation")) return "graduation";
  if (v.includes("retirement")) return "retirement";
  if (v.includes("holiday") || v.includes("christmas") || v.includes("new-year")) return "holiday-party";
  if (v.includes("corporate") || v.includes("company") || v.includes("team-event")) return "corporate-event";
  if (v.includes("elopement")) return "elopement";
  if (v.includes("civil-ceremony") || (v.includes("civil") && v.includes("ceremony"))) return "civil-ceremony";
  if (v.includes("wedding")) return "wedding";
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
        welcomeSubtext: "Let the celebration begin",
        name1: "Alex",
        name2: "Jordan",
        date: "Saturday, October 18, 2026",
        time: "6:00 PM",
        venue: "Celebration Hall",
        address: "123 Celebration Lane, Your City, ST",
        ceremonyDetails: "Birthday celebration starts at 6:00 PM with welcome drinks and photos.",
        receptionDetails: "Dinner, cake, and dancing to follow.",
        dressCode: "Festive Casual",
        saveTheDateMessage: "Save the Date for the Birthday Celebration",
        thankYouMessage: "Thank you for celebrating this birthday with us.",
      };
    case "anniversary":
      return {
        preHeading: "Together with our loved ones",
        invitationLine: "invite you to celebrate our anniversary",
        welcomeMessage: "Welcome to Our Anniversary Celebration",
        welcomeSubtext: "Please find your seat and enjoy the evening",
        name1: "Alex",
        name2: "Jordan",
        date: "Saturday, October 18, 2026",
        time: "5:00 PM",
        venue: "Anniversary House",
        address: "456 Memory Lane, Your City, ST",
        ceremonyDetails: "Anniversary celebration begins at 5:00 PM with a welcome toast.",
        receptionDetails: "Dinner and dancing to follow in the main hall.",
        dressCode: "Cocktail Attire",
        saveTheDateMessage: "Save the Date for Our Anniversary",
        thankYouMessage: "Thank you for celebrating our anniversary with us.",
      };
    case "engagement":
      return {
        preHeading: "Together with our families",
        invitationLine: "invite you to celebrate our engagement",
        welcomeMessage: "Welcome to Our Engagement Celebration",
        welcomeSubtext: "Please join us for cocktails and celebration",
        name1: "Avery",
        name2: "Cameron",
        date: "Saturday, May 8, 2027",
        time: "5:30 PM",
        venue: "Riverside Loft",
        address: "25 Harbor Street, Your City, ST",
        ceremonyDetails: "Engagement celebration begins at 5:30 PM with a welcome toast.",
        receptionDetails: "Cocktails and light bites to follow in the lounge.",
        dressCode: "Cocktail Attire",
        saveTheDateMessage: "Save the Date for Our Engagement Party",
        thankYouMessage: "Thank you for sharing in our engagement celebration.",
      };
    case "vow-renewal":
      return {
        preHeading: "Together with our loved ones",
        invitationLine: "invite you to celebrate our vow renewal",
        welcomeMessage: "Welcome to Our Vow Renewal Celebration",
        welcomeSubtext: "Thank you for celebrating this milestone with us",
        name1: "Avery",
        name2: "Cameron",
        date: "Sunday, August 22, 2027",
        time: "4:00 PM",
        venue: "Sunset Garden",
        address: "18 Willow Avenue, Your City, ST",
        ceremonyDetails: "Vow renewal begins at 4:00 PM in the garden courtyard.",
        receptionDetails: "Dinner, stories, and dancing to follow.",
        dressCode: "Semi-Formal",
        saveTheDateMessage: "Save the Date for Our Vow Renewal",
        thankYouMessage: "Thank you for celebrating our vow renewal with us.",
      };
    case "baby-shower":
      return {
        preHeading: "With joy in our hearts",
        invitationLine: "invite you to celebrate our growing family",
        welcomeMessage: "Welcome to the Baby Shower",
        welcomeSubtext: "Thank you for celebrating this special chapter",
        name1: "Taylor",
        name2: "Morgan",
        date: "Sunday, October 19, 2026",
        time: "11:00 AM",
        venue: "Garden Room",
        address: "789 Blossom Street, Your City, ST",
        ceremonyDetails: "Baby shower starts at 11:00 AM with brunch and games.",
        receptionDetails: "Light refreshments and gift opening to follow.",
        dressCode: "Pastel Garden Party",
        saveTheDateMessage: "Save the Date for the Baby Shower",
        thankYouMessage: "Thank you for showering us with love.",
      };
    case "bridal-shower":
      return {
        preHeading: "Hosted with love",
        invitationLine: "invite you to join the bridal shower celebration",
        welcomeMessage: "Welcome to the Bridal Shower",
        welcomeSubtext: "Please enjoy the celebration and festivities",
        name1: "Taylor",
        name2: "Riley",
        date: "Saturday, October 18, 2026",
        time: "1:00 PM",
        venue: "Rosewood Lounge",
        address: "321 Rose Avenue, Your City, ST",
        ceremonyDetails: "Bridal shower begins at 1:00 PM with brunch and games.",
        receptionDetails: "Gift opening and desserts to follow.",
        dressCode: "Smart Casual",
        saveTheDateMessage: "Save the Date for the Bridal Shower",
        thankYouMessage: "Thank you for celebrating the bride-to-be with us.",
      };
    case "graduation":
      return {
        preHeading: "Please join us",
        invitationLine: "invite you to celebrate this graduation milestone",
        welcomeMessage: "Welcome to the Graduation Celebration",
        welcomeSubtext: "Please enjoy the celebration and reception",
        name1: "Jordan",
        name2: "Family & Friends",
        date: "Saturday, June 12, 2027",
        time: "2:00 PM",
        venue: "Main Auditorium",
        address: "200 University Way, Your City, ST",
        ceremonyDetails: "Graduation ceremony starts at 10:00 AM at the main auditorium.",
        receptionDetails: "Celebration reception to follow at 12:30 PM.",
        dressCode: "Semi-Formal",
        saveTheDateMessage: "Save the Date for Graduation",
        thankYouMessage: "Thank you for celebrating this graduation with us.",
      };
    case "retirement":
      return {
        preHeading: "Please join us",
        invitationLine: "invite you to celebrate a remarkable retirement",
        welcomeMessage: "Welcome to the Retirement Celebration",
        welcomeSubtext: "Please enjoy the tribute and dinner",
        name1: "Alex",
        name2: "Colleagues & Friends",
        date: "Friday, September 10, 2027",
        time: "6:30 PM",
        venue: "Banquet Hall",
        address: "100 Heritage Drive, Your City, ST",
        ceremonyDetails: "Retirement celebration starts at 6:00 PM with remarks and a toast.",
        receptionDetails: "Dinner and tribute stories to follow.",
        dressCode: "Business Casual",
        saveTheDateMessage: "Save the Date for the Retirement Celebration",
        thankYouMessage: "Thank you for honoring this retirement milestone with us.",
      };
    case "holiday-party":
      return {
        preHeading: "You're invited to celebrate the season",
        invitationLine: "invite you to our holiday party",
        welcomeMessage: "Welcome to the Holiday Celebration",
        welcomeSubtext: "Enjoy food, music, and festive cheer",
        name1: "The Rivera Family",
        name2: "Friends & Neighbors",
        date: "Saturday, December 12, 2026",
        time: "7:00 PM",
        venue: "Winter Hall",
        address: "90 Evergreen Avenue, Your City, ST",
        ceremonyDetails: "Holiday party begins at 7:00 PM with seasonal drinks and appetizers.",
        receptionDetails: "Dinner, music, and celebration to follow.",
        dressCode: "Festive Attire",
        saveTheDateMessage: "Save the Date for the Holiday Party",
        thankYouMessage: "Thank you for celebrating the season with us.",
      };
    case "corporate-event":
      return {
        preHeading: "You're invited",
        invitationLine: "invite you to our corporate celebration",
        welcomeMessage: "Welcome to the Corporate Event",
        welcomeSubtext: "Please check in at reception upon arrival",
        name1: "Horizon Team",
        name2: "Clients & Partners",
        date: "Thursday, November 4, 2027",
        time: "6:00 PM",
        venue: "City Conference Center",
        address: "410 Commerce Plaza, Your City, ST",
        ceremonyDetails: "Event opens at 6:00 PM with networking and opening remarks.",
        receptionDetails: "Dinner service and keynote presentation to follow.",
        dressCode: "Business Formal",
        saveTheDateMessage: "Save the Date for Our Corporate Event",
        thankYouMessage: "Thank you for being part of our event.",
      };
    case "elopement":
      return {
        preHeading: "A small celebration with those we love",
        invitationLine: "invite you to celebrate our elopement",
        welcomeMessage: "Welcome to Our Elopement Celebration",
        welcomeSubtext: "Thank you for joining our intimate celebration",
        name1: "Avery",
        name2: "Cameron",
        date: "Friday, July 16, 2027",
        time: "4:00 PM",
        venue: "Cliffside Terrace",
        address: "12 Seaview Point, Your City, ST",
        ceremonyDetails: "Intimate ceremony begins at 4:00 PM on the terrace.",
        receptionDetails: "Champagne toast and dinner to follow.",
        dressCode: "Elegant Casual",
        saveTheDateMessage: "Save the Date for Our Elopement Celebration",
        thankYouMessage: "Thank you for sharing in our elopement celebration.",
      };
    case "civil-ceremony":
      return {
        preHeading: "Together with our loved ones",
        invitationLine: "invite you to celebrate our civil ceremony",
        welcomeMessage: "Welcome to Our Civil Ceremony Celebration",
        welcomeSubtext: "Please join us after the ceremony for refreshments",
        name1: "Avery",
        name2: "Cameron",
        date: "Friday, June 18, 2027",
        time: "3:30 PM",
        venue: "City Hall Atrium",
        address: "1 Municipal Square, Your City, ST",
        ceremonyDetails: "Civil ceremony begins at 3:30 PM in the city hall chamber.",
        receptionDetails: "Refreshments and photos to follow nearby.",
        dressCode: "Semi-Formal",
        saveTheDateMessage: "Save the Date for Our Civil Ceremony",
        thankYouMessage: "Thank you for celebrating our civil ceremony with us.",
      };
    case "wedding":
      return {
        preHeading: "Hosted by friends and family",
        invitationLine: "invite you to celebrate with us",
        welcomeMessage: "Welcome to Our Celebration",
        welcomeSubtext: "Please find your seat and enjoy the celebration",
        name1: "Alex",
        name2: "Jordan",
        date: "Saturday, October 18, 2026",
        time: "4:30 PM",
        venue: "Celebration Hall",
        address: "123 Celebration Lane, Your City, ST",
        ceremonyDetails: "Ceremony begins at 4:30 PM in the garden.",
        receptionDetails: "Reception to follow in the grand ballroom.",
        dressCode: "Black Tie Optional",
        saveTheDateMessage: "Save the Date",
        thankYouMessage: "Thank you for sharing in our special day.",
      };
    default:
      return {
        preHeading: "Hosted by friends and family",
        invitationLine: "invite you to celebrate with us",
        welcomeMessage: "Welcome to Our Celebration",
        welcomeSubtext: "Please find your seat and enjoy the celebration",
        name1: "Alex",
        name2: "Jordan",
        date: "Saturday, October 18, 2026",
        time: "4:30 PM",
        venue: "Celebration Hall",
        address: "123 Celebration Lane, Your City, ST",
        ceremonyDetails: "Main event begins at 4:30 PM in the main venue.",
        receptionDetails: "Celebration and refreshments to follow.",
        dressCode: "Event Attire",
        saveTheDateMessage: "Save the Date",
        thankYouMessage: "Thank you for celebrating with us.",
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
    const normalizedPreset = normalizeEventPreset(eventType);
    const starter = starterCopyForPreset(normalizedPreset);
    const update: Record<string, string> = { eventType: normalizedPreset };
    const starterSamples = EVENT_PRESETS.map((preset) =>
      starterCopyForPreset(preset.value),
    );
    const allowFromStarters = (field: keyof EventStarterCopy) =>
      starterSamples.map((sample) => sample[field].trim().toLowerCase());

    if (
      shouldReplaceField(content.preHeading, [
        "hosted by their loved ones",
        "hosted by friends and family",
        "together with their families",
        ...allowFromStarters("preHeading"),
      ])
    ) {
      update.preHeading = starter.preHeading;
    }

    if (
      shouldReplaceField(content.invitationLine, [
        "invite you to celebrate with us",
        "invite you to celebrate their marriage",
        ...allowFromStarters("invitationLine"),
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
        ...allowFromStarters("welcomeMessage"),
      ])
    ) {
      update.welcomeMessage = starter.welcomeMessage;
    }

    if (shouldReplaceField(content.welcomeSubtext, [
      "please find your seat",
      "please find your seat and enjoy the celebration",
      ...allowFromStarters("welcomeSubtext"),
    ])) {
      update.welcomeSubtext = starter.welcomeSubtext;
    }

    if (shouldReplaceField(content.name1, [
      "name one",
      "alex",
      "taylor",
      "jordan",
      "avery",
      "horizon team",
      "the rivera family",
    ])) {
      update.name1 = starter.name1;
    }
    if (shouldReplaceField(content.name2, [
      "name two",
      "jordan",
      "riley",
      "family & friends",
      "colleagues & friends",
      "friends & neighbors",
      "clients & partners",
      "morgan",
      "cameron",
    ])) {
      update.name2 = starter.name2;
    }
    if (shouldReplaceField(content.date, [
      "your event date",
      ...allowFromStarters("date"),
    ])) {
      update.date = starter.date;
    }
    if (shouldReplaceField(content.time, [
      "your event time",
      ...allowFromStarters("time"),
    ])) {
      update.time = starter.time;
    }
    if (shouldReplaceField(content.venue, [
      "your event venue",
      ...allowFromStarters("venue"),
    ])) {
      update.venue = starter.venue;
    }
    if (shouldReplaceField(content.address, [
      "your event location",
      "your event address",
      ...allowFromStarters("address"),
    ])) {
      update.address = starter.address;
    }
    if (shouldReplaceField(content.ceremonyDetails, [
      "ceremony begins at 4:30 pm in the garden.",
      ...allowFromStarters("ceremonyDetails"),
    ])) {
      update.ceremonyDetails = starter.ceremonyDetails;
    }
    if (shouldReplaceField(content.receptionDetails, [
      "reception to follow in the grand ballroom.",
      ...allowFromStarters("receptionDetails"),
    ])) {
      update.receptionDetails = starter.receptionDetails;
    }
    if (shouldReplaceField(content.dressCode, [
      "black tie optional",
      ...allowFromStarters("dressCode"),
    ])) {
      update.dressCode = starter.dressCode;
    }
    if (shouldReplaceField(content.saveTheDateMessage, [
      "save the date",
      ...allowFromStarters("saveTheDateMessage"),
    ])) {
      update.saveTheDateMessage = starter.saveTheDateMessage;
    }
    if (shouldReplaceField(content.thankYouMessage, [
      "thank you for sharing in our special day.",
      ...allowFromStarters("thankYouMessage"),
    ])) {
      update.thankYouMessage = starter.thankYouMessage;
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
