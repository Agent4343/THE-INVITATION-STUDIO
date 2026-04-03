"use client";

import React from "react";
import type { Template, Palette, Font, DesignContent } from "@/types";
import { OrnamentalDivider } from "./Ornaments";

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

export default function PlaceCardPreview({ template, palette, font, content }: PreviewProps) {
  const baseSpacing = 16 * template.spacingRatio;

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "3.5 / 2",
        backgroundColor: palette.bg,
        fontFamily: `"${font.name}", ${font.category}`,
        color: palette.text,
        padding: `${baseSpacing * 1.5}px ${baseSpacing * 2}px`,
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
      {template.ornament && (
        <OrnamentalDivider style={template.ornamentStyle || "classic"} color={palette.accent} size="sm" />
      )}

      <h1
        style={{
          fontSize: "26px",
          fontWeight: font.previewWeight,
          color: palette.primary,
          margin: `${baseSpacing * 0.5}px 0`,
          lineHeight: 1.2,
          textAlign: "center",
          letterSpacing: "1px",
          ...(!content.guestName ? { opacity: 0.4 } : {}),
        }}
      >
        {content.guestName || content.guestPrompt || "Guest Name"}
      </h1>

      {template.ornament && (
        <OrnamentalDivider style={template.ornamentStyle || "classic"} color={palette.accent} size="sm" />
      )}
    </div>
  );
}
