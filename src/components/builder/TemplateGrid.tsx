"use client";

import React from "react";
import { useDesignStore } from "@/store/designStore";
import { templates } from "@/data/templates";
import Card from "@/components/ui/Card";

const ornamentSymbols: Record<string, string> = {
  classic: "\u2726",    // ✦ four-point star
  botanical: "\u2737",  // ✷ flower
  geometric: "\u25C6",  // ◆ diamond
  "art-deco": "\u25CA", // ◊ lozenge
  minimal: "\u2014",    // — em dash
  flourish: "\u2767",   // ❧ scroll
  vintage: "\u2740",    // ❀ floral
  romantic: "\u2764",   // ❤ heart
};

const bottomOrnamentSymbols: Record<string, string> = {
  classic: "\u2726 \u2726 \u2726",
  botanical: "\u2E19 \u2737 \u2E19",
  geometric: "\u25C7 \u25C6 \u25C7",
  "art-deco": "\u25CA \u25CA \u25CA",
  minimal: "\u2014",
  flourish: "\u2766 \u2767 \u2766",
  vintage: "\u273F \u2740 \u273F",
  romantic: "\u2765 \u2764 \u2765",
};

export default function TemplateGrid() {
  const { template: selected, setTemplate } = useDesignStore();

  return (
    <div className="max-h-[600px] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-4">
        {templates.map((t) => (
          <Card
            key={t.id}
            selected={selected.id === t.id}
            onClick={() => setTemplate(t)}
          >
            <div
              className="mb-3 flex aspect-[5/7] flex-col items-center justify-center rounded-md overflow-hidden"
              style={{
                backgroundColor: "#FAF8F5",
                border:
                  t.borderStyle === "double"
                    ? "3px double #B8B0A4"
                    : t.borderStyle === "thin"
                      ? "1px solid #C8C0B4"
                      : "none",
                padding: "12px 10px",
              }}
            >
              {/* Template name as header */}
              <span
                className="mb-2 text-[9px] tracking-[0.2em] uppercase"
                style={{ color: "#9A9083" }}
              >
                {t.name}
              </span>

              {/* Ornament indicator */}
              {t.ornament && (
                <div
                  className="mb-2 text-[10px]"
                  style={{ color: "#C4B9A8" }}
                >
                  {ornamentSymbols[t.ornamentStyle || "classic"] || "\u2726"}
                </div>
              )}

              {/* Layout preview lines */}
              <div
                className="flex w-full flex-col gap-1"
                style={{
                  alignItems:
                    t.layout === "left"
                      ? "flex-start"
                      : t.layout === "split"
                        ? "stretch"
                        : "center",
                }}
              >
                {t.layout === "split" ? (
                  <div className="flex w-full gap-2">
                    <div className="flex flex-1 flex-col gap-1 items-start">
                      <div className="h-[2px] w-3/4 rounded-full" style={{ backgroundColor: "#C8C0B4" }} />
                      <div className="h-[2px] w-1/2 rounded-full" style={{ backgroundColor: "#D8D2C8" }} />
                      <div className="h-[2px] w-2/3 rounded-full" style={{ backgroundColor: "#D8D2C8" }} />
                    </div>
                    <div className="flex flex-1 flex-col gap-1 items-start">
                      <div className="h-[2px] w-3/4 rounded-full" style={{ backgroundColor: "#C8C0B4" }} />
                      <div className="h-[2px] w-1/2 rounded-full" style={{ backgroundColor: "#D8D2C8" }} />
                      <div className="h-[2px] w-2/3 rounded-full" style={{ backgroundColor: "#D8D2C8" }} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className="h-[2px] rounded-full"
                      style={{
                        backgroundColor: "#C8C0B4",
                        width: t.layout === "left" ? "70%" : "50%",
                      }}
                    />
                    <div
                      className="h-[2px] rounded-full"
                      style={{
                        backgroundColor: "#D8D2C8",
                        width: t.layout === "left" ? "55%" : "65%",
                      }}
                    />
                    <div
                      className="h-[2px] rounded-full"
                      style={{
                        backgroundColor: "#D8D2C8",
                        width: t.layout === "left" ? "45%" : "40%",
                      }}
                    />
                    <div className="h-1" />
                    <div
                      className="h-[2px] rounded-full"
                      style={{
                        backgroundColor: "#D8D2C8",
                        width: t.layout === "left" ? "60%" : "55%",
                      }}
                    />
                    <div
                      className="h-[2px] rounded-full"
                      style={{
                        backgroundColor: "#D8D2C8",
                        width: t.layout === "left" ? "50%" : "45%",
                      }}
                    />
                  </>
                )}
              </div>

              {/* Ornament at bottom */}
              {t.ornament && (
                <div
                  className="mt-2 text-[8px]"
                  style={{ color: "#C4B9A8" }}
                >
                  {bottomOrnamentSymbols[t.ornamentStyle || "classic"] || "\u2022 \u2022 \u2022"}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-stone-800">{t.name}</h3>
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
                {t.layout}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
