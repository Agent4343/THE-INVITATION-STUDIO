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
      return { border: `3px double ${color}` };
    case "none":
    default:
      return {};
  }
}

export default function RSVPPreview({ template, palette, font, content }: PreviewProps) {
  const baseSpacing = 16 * template.spacingRatio;
  const ornStyle = template.ornamentStyle || "classic";

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "5 / 3.5",
        backgroundColor: palette.bg,
        fontFamily: `"${font.name}", ${font.category}`,
        color: palette.text,
        padding: `${baseSpacing * 2}px ${baseSpacing * 2}px`,
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
      {/* Subtle inner frame */}
      {ornStyle !== "minimal" && (
        <div
          style={{
            position: "absolute",
            inset: `${baseSpacing * 0.6}px`,
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
        }}
      >
        Kindly Respond
      </p>

      <h2
        style={{
          fontSize: "26px",
          fontWeight: font.previewWeight,
          color: palette.primary,
          letterSpacing: "5px",
          textTransform: "uppercase",
          margin: `0 0 ${baseSpacing * 0.4}px 0`,
          textAlign: "center",
        }}
      >
        RSVP
      </h2>

      {template.ornament && (
        <OrnamentalDivider style={ornStyle} color={palette.accent} size="sm" />
      )}

      <p
        style={{
          fontSize: "10px",
          color: palette.muted,
          letterSpacing: "2px",
          textTransform: "uppercase",
          margin: `${baseSpacing * 0.3}px 0 ${baseSpacing * 0.3}px 0`,
          textAlign: "center",
        }}
      >
        Please respond by
      </p>

      <p
        style={{
          fontSize: "14px",
          color: palette.text,
          fontWeight: 500,
          margin: `0 0 ${baseSpacing * 1.5}px 0`,
          letterSpacing: "1px",
          textAlign: "center",
          ...(!content.rsvpDeadline ? { opacity: 0.4 } : {}),
        }}
      >
        {content.rsvpDeadline || "September 1, 2026"}
      </p>

      {/* Name line */}
      <div style={{ width: "75%", margin: `0 0 ${baseSpacing}px 0` }}>
        <p
          style={{
            fontSize: "12px",
            color: palette.text,
            margin: 0,
            paddingBottom: "3px",
            borderBottom: `1px solid ${palette.muted}`,
            opacity: 0.7,
          }}
        >
          M{" "}
          <span style={{ color: "transparent", userSelect: "none", fontSize: "10px" }}>
            ______________________________
          </span>
        </p>
      </div>

      {/* Response options */}
      <div
        style={{
          width: "75%",
          display: "flex",
          flexDirection: "column",
          gap: `${baseSpacing * 0.5}px`,
        }}
      >
        {["Joyfully accepts", "Respectfully declines"].map((text) => (
          <label
            key={text}
            style={{
              fontSize: "11px",
              color: palette.text,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "default",
              letterSpacing: "0.5px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                border: `1px solid ${palette.muted}`,
                borderRadius: ornStyle === "romantic" || ornStyle === "botanical" ? "50%" : "1px",
                flexShrink: 0,
                opacity: 0.6,
              }}
            />
            {text}
          </label>
        ))}
      </div>
    </div>
  );
}
