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

export default function RSVPPreview({ template, palette, font, content }: PreviewProps) {
  const baseSpacing = 16 * template.spacingRatio;

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "5 / 3.5",
        backgroundColor: palette.bg,
        fontFamily: `"${font.name}", ${font.category}`,
        color: palette.text,
        padding: `${baseSpacing * 2.5}px ${baseSpacing * 2}px`,
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
          fontSize: "28px",
          fontWeight: font.previewWeight,
          color: palette.primary,
          letterSpacing: "6px",
          textTransform: "uppercase",
          margin: `0 0 ${baseSpacing}px 0`,
          textAlign: "center",
        }}
      >
        RSVP
      </h2>

      {template.ornament && (
        <div style={{ margin: `0 0 ${baseSpacing * 1.5}px 0` }}>
          <OrnamentalDivider style={template.ornamentStyle || "classic"} color={palette.accent} size="sm" />
        </div>
      )}

      <p
        style={{
          fontSize: "12px",
          color: palette.muted,
          letterSpacing: "2px",
          textTransform: "uppercase",
          margin: `0 0 ${baseSpacing * 0.5}px 0`,
          textAlign: "center",
        }}
      >
        Kindly respond by
      </p>

      <p
        style={{
          fontSize: "15px",
          color: palette.text,
          fontWeight: 500,
          margin: `0 0 ${baseSpacing * 2}px 0`,
          letterSpacing: "1px",
          textAlign: "center",
          ...(!content.rsvpDeadline ? { opacity: 0.4 } : {}),
        }}
      >
        {content.rsvpDeadline || "Date"}
      </p>

      <div
        style={{
          width: "80%",
          margin: `0 0 ${baseSpacing * 1.5}px 0`,
          textAlign: "left",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: palette.text,
            margin: 0,
            paddingBottom: "4px",
            borderBottom: `1px solid ${palette.muted}`,
          }}
        >
          M{" "}
          <span style={{ color: "transparent", userSelect: "none" }}>
            ______________________________
          </span>
        </p>
      </div>

      <div
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          gap: `${baseSpacing * 0.75}px`,
        }}
      >
        <label
          style={{
            fontSize: "13px",
            color: palette.text,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "default",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              border: `1px solid ${palette.muted}`,
              flexShrink: 0,
            }}
          />
          Accepts with pleasure
        </label>

        <label
          style={{
            fontSize: "13px",
            color: palette.text,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "default",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              border: `1px solid ${palette.muted}`,
              flexShrink: 0,
            }}
          />
          Declines with regret
        </label>
      </div>
    </div>
  );
}
