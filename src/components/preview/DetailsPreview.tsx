"use client";

import React from "react";
import type { Template, Palette, Font, DesignContent } from "@/types";
import { OrnamentalDivider, SectionDivider } from "./Ornaments";

interface PreviewProps {
  template: Template;
  palette: Palette;
  font: Font;
  content: DesignContent;
}

function normalizeEventType(value?: string): string {
  return (value || "celebration").trim().toLowerCase();
}

function detailsConfigForEventType(eventType: string): {
  dayLabel: string;
  detailsTitle: string;
  sectionOneLabel: string;
  sectionOnePlaceholder: string;
  sectionTwoLabel: string;
  sectionTwoPlaceholder: string;
  dressCodeLabel: string;
  dressCodePlaceholder: string;
} {
  switch (eventType) {
    case "birthday":
      return {
        dayLabel: "Birthday Event",
        detailsTitle: "Celebration Details",
        sectionOneLabel: "Main Event",
        sectionOnePlaceholder: "Birthday celebration starts at 4:30 PM\nin the main event space",
        sectionTwoLabel: "After Party",
        sectionTwoPlaceholder: "Dinner, cake, and dancing to follow\nin the lounge",
        dressCodeLabel: "Dress Style",
        dressCodePlaceholder: "Party Chic",
      };
    case "anniversary":
      return {
        dayLabel: "Anniversary Event",
        detailsTitle: "Anniversary Details",
        sectionOneLabel: "Ceremony",
        sectionOnePlaceholder: "Anniversary ceremony starts at 4:30 PM\nin the garden",
        sectionTwoLabel: "Celebration",
        sectionTwoPlaceholder: "Dinner and toasts to follow\nin the ballroom",
        dressCodeLabel: "Dress Style",
        dressCodePlaceholder: "Cocktail Attire",
      };
    case "baby-shower":
    case "bridal-shower":
      return {
        dayLabel: "Shower Event",
        detailsTitle: "Shower Details",
        sectionOneLabel: "Gathering",
        sectionOnePlaceholder: "Shower gathering begins at 11:00 AM\nin the garden room",
        sectionTwoLabel: "Activities",
        sectionTwoPlaceholder: "Brunch, games, and gifts to follow\nin the main hall",
        dressCodeLabel: "Dress Style",
        dressCodePlaceholder: "Daytime Smart Casual",
      };
    case "graduation":
      return {
        dayLabel: "Graduation Event",
        detailsTitle: "Graduation Details",
        sectionOneLabel: "Ceremony",
        sectionOnePlaceholder: "Graduation ceremony begins at 2:00 PM\nat the auditorium",
        sectionTwoLabel: "Reception",
        sectionTwoPlaceholder: "Family reception to follow\nat the celebration hall",
        dressCodeLabel: "Dress Style",
        dressCodePlaceholder: "Semi-Formal",
      };
    case "retirement":
      return {
        dayLabel: "Retirement Event",
        detailsTitle: "Retirement Details",
        sectionOneLabel: "Reception",
        sectionOnePlaceholder: "Retirement reception starts at 6:00 PM\nin the banquet room",
        sectionTwoLabel: "Program",
        sectionTwoPlaceholder: "Dinner, speeches, and tributes to follow\nin the main hall",
        dressCodeLabel: "Dress Style",
        dressCodePlaceholder: "Business Casual",
      };
    default:
      return {
        dayLabel: "Event Day",
        detailsTitle: "Event Details",
        sectionOneLabel: "Main Event",
        sectionOnePlaceholder: "Main event begins at 4:30 PM\nin the Rose Garden",
        sectionTwoLabel: "Celebration",
        sectionTwoPlaceholder: "Celebration to follow\nin the Grand Ballroom",
        dressCodeLabel: "Dress Style",
        dressCodePlaceholder: "Black Tie Optional",
      };
  }
}

function getBorderStyle(borderStyle: Template["borderStyle"], color: string): React.CSSProperties {
  switch (borderStyle) {
    case "thin":
      return { border: `1px solid ${color}` };
    case "double":
      return { border: `3px double ${color}` };
    case "none":
    default:
      return {};
  }
}

export default function DetailsPreview({ template, palette, font, content }: PreviewProps) {
  const baseSpacing = 16 * template.spacingRatio;
  const ornStyle = template.ornamentStyle || "classic";
  const detailsConfig = detailsConfigForEventType(
    normalizeEventType(content.eventType),
  );

  const sections = [
    {
      label: detailsConfig.sectionOneLabel,
      icon: "\u2736",
      detail: content.ceremonyDetails,
      placeholder: detailsConfig.sectionOnePlaceholder,
    },
    {
      label: detailsConfig.sectionTwoLabel,
      icon: "\u2737",
      detail: content.receptionDetails,
      placeholder: detailsConfig.sectionTwoPlaceholder,
    },
    {
      label: detailsConfig.dressCodeLabel,
      icon: "\u2726",
      detail: content.dressCode,
      placeholder: detailsConfig.dressCodePlaceholder,
    },
  ];
  const dayLabel = detailsConfig.dayLabel;

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "5 / 7",
        backgroundColor: palette.bg,
        fontFamily: `"${font.name}", ${font.category}`,
        color: palette.text,
        padding: `${baseSpacing * 3}px ${baseSpacing * 2}px`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        ...getBorderStyle(template.borderStyle, palette.muted),
      }}
    >
      {/* Inner frame */}
      {ornStyle !== "minimal" && (
        <div
          style={{
            position: "absolute",
            inset: `${baseSpacing * 0.9}px`,
            border: `1px solid ${palette.accent}`,
            opacity: 0.12,
            pointerEvents: "none",
          }}
        />
      )}

      <p
        style={{
          fontSize: "9px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: palette.muted,
          margin: `0 0 ${baseSpacing * 0.4}px 0`,
          textAlign: "center",
          opacity: 0.8,
          zIndex: 1,
        }}
      >
        {dayLabel}
      </p>

      <h2
        style={{
          fontSize: "20px",
          fontWeight: font.previewWeight,
          color: palette.primary,
          letterSpacing: "4px",
          textTransform: "uppercase",
          margin: `0 0 ${baseSpacing * 0.3}px 0`,
          textAlign: "center",
          zIndex: 1,
        }}
      >
        {detailsConfig.detailsTitle}
      </h2>

      {template.ornament && (
        <div style={{ zIndex: 1 }}>
          <OrnamentalDivider style={ornStyle} color={palette.accent} />
        </div>
      )}

      <div
        style={{
          width: "100%",
          maxWidth: "300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: `${baseSpacing}px`,
          zIndex: 1,
        }}
      >
        {sections.map((section, index) => (
          <div key={section.label} style={{ width: "100%", textAlign: "center" }}>
            {index > 0 && template.ornament && <SectionDivider style={ornStyle} color={palette.accent} />}
            {index > 0 && !template.ornament && (
              <div style={{ width: "30px", height: "1px", backgroundColor: palette.muted, opacity: 0.2, margin: "14px auto" }} />
            )}

            <h3
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: palette.accent,
                letterSpacing: "3px",
                textTransform: "uppercase",
                margin: `0 0 ${baseSpacing * 0.4}px 0`,
              }}
            >
              {section.label}
            </h3>

            <p
              style={{
                fontSize: "12px",
                color: palette.text,
                margin: 0,
                lineHeight: 1.7,
                whiteSpace: "pre-line",
                ...(!section.detail ? { opacity: 0.4 } : {}),
              }}
            >
              {section.detail || section.placeholder}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
