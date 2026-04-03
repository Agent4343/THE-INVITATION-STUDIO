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

function getBorderStyle(borderStyle: Template["borderStyle"], color: string): React.CSSProperties {
  switch (borderStyle) {
    case "thin":
      return { border: `1px solid ${color}` };
    case "double":
      return { border: `4px double ${color}` };
    case "none":
    default:
      return {};
  }
}

export default function DetailsPreview({ template, palette, font, content }: PreviewProps) {
  const baseSpacing = 16 * template.spacingRatio;

  const placeholders: Record<string, string> = {
    Ceremony: "Ceremony details",
    Reception: "Reception details",
    "Dress Code": "Dress code details",
  };

  const sections = [
    { label: "Ceremony", detail: content.ceremonyDetails },
    { label: "Reception", detail: content.receptionDetails },
    { label: "Dress Code", detail: content.dressCode },
  ];

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
      <h2
        style={{
          fontSize: "22px",
          fontWeight: font.previewWeight,
          color: palette.primary,
          letterSpacing: "4px",
          textTransform: "uppercase",
          margin: `0 0 ${baseSpacing * 0.5}px 0`,
          textAlign: "center",
        }}
      >
        Wedding Details
      </h2>

      {template.ornament && (
        <div style={{ margin: `0 0 ${baseSpacing * 1.5}px 0` }}>
          <OrnamentalDivider style={template.ornamentStyle || "classic"} color={palette.accent} />
        </div>
      )}

      <div
        style={{
          width: "100%",
          maxWidth: "320px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {sections.map((section, index) => (
          <div key={section.label} style={{ width: "100%", textAlign: "center" }}>
            {index > 0 && template.ornament && <SectionDivider style={template.ornamentStyle || "classic"} color={palette.accent} />}

            <h3
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: palette.accent,
                letterSpacing: "3px",
                textTransform: "uppercase",
                margin: `0 0 ${baseSpacing * 0.5}px 0`,
              }}
            >
              {section.label}
            </h3>

            <p
              style={{
                fontSize: "13px",
                color: palette.text,
                margin: 0,
                lineHeight: 1.7,
                whiteSpace: "pre-line",
                ...(!section.detail ? { opacity: 0.4 } : {}),
              }}
            >
              {section.detail || placeholders[section.label]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
