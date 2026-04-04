"use client";

import React, { useMemo, useState } from "react";
import { useDesignStore } from "@/store/designStore";
import Button from "@/components/ui/Button";
import { trackEvent } from "@/lib/clientAnalytics";

const etsyPathOptions = [
  {
    id: "listing",
    title: "Direct to Etsy listing",
    description:
      "Fastest path for most buyers. We pre-fill your personalization note and send you straight to the listing.",
  },
  {
    id: "message",
    title: "Message seller first",
    description:
      "Best for special requests, unusual event formats, or large custom quantities before paying.",
  },
] as const;

type EtsyPath = (typeof etsyPathOptions)[number]["id"];

const itemOptions = [
  { id: "invitation", title: "Main Invitation" },
  { id: "rsvp", title: "RSVP Card" },
  { id: "details", title: "Details Card" },
  { id: "menu", title: "Menu Card" },
  { id: "thankyou", title: "Thank You Card" },
  { id: "savethedate", title: "Save the Date" },
  { id: "tablenumber", title: "Table Number" },
  { id: "placecard", title: "Place Card" },
  { id: "welcomesign", title: "Welcome Sign" },
] as const;

type EtsyItemId = (typeof itemOptions)[number]["id"];

const addOnOptions = [
  { id: "rush-proof", label: "Rush proof turnaround (24-48h)" },
  { id: "extra-revisions", label: "Extra revisions beyond standard" },
  { id: "matching-envelopes", label: "Matching envelope recommendation" },
  { id: "print-consult", label: "Print specification consult" },
] as const;

type EtsyAddOnId = (typeof addOnOptions)[number]["id"];

export default function EtsyCheckoutPanel() {
  const { designId, token, template, palette, font, content } = useDesignStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [etsyPath, setEtsyPath] = useState<EtsyPath>("listing");
  const [selectedItems, setSelectedItems] = useState<EtsyItemId[]>([
    "invitation",
    "rsvp",
    "details",
  ]);
  const [noteCopied, setNoteCopied] = useState(false);
  const [previewNote, setPreviewNote] = useState<string>("");
  const [selectedRouteLabel, setSelectedRouteLabel] = useState<string>("");
  const [selectedAddOns, setSelectedAddOns] = useState<EtsyAddOnId[]>([]);
  const [checkoutUrl, setCheckoutUrl] = useState<string>("");

  const headline = useMemo(() => {
    const eventType = (content.eventType || "event").toLowerCase();
    if (eventType === "anniversary") return "Anniversary stationery";
    if (eventType === "vow-renewal") return "Vow renewal stationery";
    if (eventType === "engagement") return "Engagement stationery";
    if (eventType === "birthday") return "Birthday stationery";
    if (eventType === "baby-shower") return "Baby shower stationery";
    if (eventType === "bridal-shower") return "Bridal shower stationery";
    if (eventType === "graduation") return "Graduation stationery";
    if (eventType === "retirement") return "Retirement stationery";
    if (eventType === "holiday") return "Holiday stationery";
    if (eventType === "corporate-event") return "Event stationery";
    return "Event stationery";
  }, [content.eventType]);

  const hasBundleDeal = selectedItems.length >= 4;

  function toggleItem(item: EtsyItemId) {
    setSelectedItems((prev) => {
      if (prev.includes(item)) {
        if (prev.length === 1) return prev;
        return prev.filter((i) => i !== item);
      }
      return [...prev, item];
    });
  }

  function toggleAddOn(addOnId: EtsyAddOnId) {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId],
    );
  }

  async function requestEtsyCheckout() {
    setLoading(true);
    setError(null);
    setNoteCopied(false);
    setSelectedRouteLabel("");
    setCheckoutUrl("");

    try {
      const selectedItemsPayload = selectedItems.map((id) => ({ id, quantity: 1 }));
      const hasAuthDesign = Boolean(designId && token);
      const endpoint = hasAuthDesign ? "/api/etsy/checkout" : "/api/etsy/preview-checkout";
      const requestBody = hasAuthDesign
        ? {
            designId,
            etsyPath,
            selectedItems: selectedItemsPayload,
            requestBundleDeal: hasBundleDeal,
            selectedAddOns,
          }
        : {
            etsyPath,
            selectedItems: selectedItemsPayload,
            content,
            templateName: template.name,
            paletteName: palette.name,
            fontName: font.name,
            requestBundleDeal: hasBundleDeal,
            selectedAddOns,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(hasAuthDesign ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      if (!res.ok) {
        void trackEvent("etsy_handoff_error", {
          status: res.status,
          mode: hasAuthDesign ? "redeemed" : "preview",
          error: String(data.error || "UNKNOWN"),
        });
        throw new Error(data.error || "Unable to prepare Etsy checkout.");
      }

      setPreviewNote(data.personalizationText || "");
      setSelectedRouteLabel(data.selectedRoute?.listing_label || "Primary Etsy listing");
      void trackEvent("etsy_handoff_success", {
        mode: hasAuthDesign ? "redeemed" : "preview",
        etsyPath,
        itemCount: selectedItems.length,
      });
      if (data.checkoutUrl) {
        setCheckoutUrl(data.checkoutUrl);
        const popup = window.open(data.checkoutUrl, "_blank", "noopener,noreferrer");
        if (!popup) {
          setError(
            "Your browser blocked the Etsy tab. Use the buttons below to continue checkout.",
          );
        }
      }
    } catch (err) {
      void trackEvent("etsy_handoff_error", {
        mode: designId && token ? "redeemed" : "preview",
        error: err instanceof Error ? err.message : "UNKNOWN",
      });
      setError(
        err instanceof Error ? err.message : "Unable to open Etsy checkout.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyNote() {
    if (!previewNote) return;
    try {
      await navigator.clipboard.writeText(previewNote);
      setNoteCopied(true);
    } catch {
      setNoteCopied(false);
    }
  }

  return (
    <div className="mt-6 space-y-4 rounded-lg border border-stone-200 bg-white p-5">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-500">
          Finish on Etsy
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Your event stationery is ready as {headline}. For compliance, payment is completed
          on Etsy. We send your personalization details so the seller can produce
          exactly what you approved.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Optional add-ons (request on Etsy)
        </p>
        <p className="text-xs text-stone-500">
          Select paid extras you want included in the Etsy personalization note.
        </p>
        {addOnOptions.map((addOn) => (
          <label
            key={addOn.id}
            className={`block cursor-pointer rounded-md border p-3 transition-colors ${
              selectedAddOns.includes(addOn.id)
                ? "border-stone-700 bg-stone-50"
                : "border-stone-200 bg-white hover:border-stone-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="etsyAddOns"
                checked={selectedAddOns.includes(addOn.id)}
                onChange={() => toggleAddOn(addOn.id)}
                className="mt-1"
              />
              <div>
                <p className="text-sm font-medium text-stone-800">{addOn.label}</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Choose what you want to purchase
        </p>
        <p className="text-xs text-stone-500">
          Select individual items instead of fixed packages.
        </p>
        {itemOptions.map((item) => (
          <label
            key={item.id}
            className={`block cursor-pointer rounded-md border p-3 transition-colors ${
              selectedItems.includes(item.id)
                ? "border-stone-700 bg-stone-50"
                : "border-stone-200 bg-white hover:border-stone-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="etsyItems"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleItem(item.id)}
                className="mt-1"
              />
              <div>
                <p className="text-sm font-medium text-stone-800">{item.title}</p>
              </div>
            </div>
          </label>
        ))}
        <p className="text-xs text-stone-500">
          Selected: {selectedItems.length} item{selectedItems.length === 1 ? "" : "s"}
        </p>
        {hasBundleDeal && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Bundle Bonus unlocked: we include a deal request in your Etsy note
            (ask seller for matching envelopes + priority proof review on 4+ items).
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Etsy handoff mode
        </p>
        {etsyPathOptions.map((option) => (
          <label
            key={option.id}
            className={`block cursor-pointer rounded-md border p-3 transition-colors ${
              etsyPath === option.id
                ? "border-stone-700 bg-stone-50"
                : "border-stone-200 bg-white hover:border-stone-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="etsyPath"
                checked={etsyPath === option.id}
                onChange={() => setEtsyPath(option.id)}
                className="mt-1"
              />
              <div>
                <p className="text-sm font-medium text-stone-800">{option.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-stone-500">
                  {option.description}
                </p>
              </div>
            </div>
          </label>
        ))}
      </div>

      <Button
        onClick={requestEtsyCheckout}
        loading={loading}
        className="w-full"
        size="lg"
      >
        {loading ? "Preparing Etsy handoff..." : "Continue to Etsy Purchase"}
      </Button>

      <p className="text-center text-xs text-stone-500">
        Payment and order confirmation are handled on Etsy. Keep this tab open
        until your Etsy checkout is complete.
      </p>
      <p className="text-center text-xs text-stone-500">
        Files are not downloaded directly in this app. Admin finalizes and
        fulfills files through Etsy after purchase.
      </p>
      {selectedRouteLabel && (
        <p className="text-center text-xs text-stone-500">
          Routed to: <span className="font-medium text-stone-700">{selectedRouteLabel}</span>
        </p>
      )}
      {checkoutUrl && (
        <div className="flex flex-wrap justify-center gap-2">
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
          >
            Open Etsy in new tab
          </a>
          <a
            href={checkoutUrl}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
          >
            Open Etsy in this tab
          </a>
        </div>
      )}

      {previewNote && (
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Personalization note sent to Etsy
            </p>
            <button
              type="button"
              onClick={copyNote}
              className="text-xs font-medium text-stone-700 underline underline-offset-2"
            >
              {noteCopied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="max-h-44 overflow-auto whitespace-pre-wrap break-words text-xs text-stone-600">
            {previewNote}
          </pre>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

