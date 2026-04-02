"use client";

import React from "react";
import type { Template, Palette, Font, DesignContent } from "@/types";

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

export default function ThankYouPreview({ template, palette, font, content }: PreviewProps) {
  const baseSpacing = 16 * template.spacingRatio;

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "5 / 3.5",
        backgroundColor: palette.bg,
        fontFamily: `"${font.name}", ${font.category}`,
        color: palette.text,
        padding: `${baseSpacing * 2.5}px ${baseSpacing * 2.5}px`,
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
          fontSize: "34px",
          fontWeight: font.previewWeight,
          color: palette.primary,
          margin: 0,
          textAlign: "center",
          lineHeight: 1.2,
          letterSpacing: "1px",
        }}
      >
        Thank You
      </h2>

      {template.ornament && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            margin: `${baseSpacing}px 0`,
            color: palette.accent,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "40px",
              height: "1px",
              backgroundColor: palette.accent,
              opacity: 0.5,
            }}
          />
          <span style={{ fontSize: "10px", letterSpacing: "4px" }}>&#10022;</span>
          <span
            style={{
              display: "inline-block",
              width: "40px",
              height: "1px",
              backgroundColor: palette.accent,
              opacity: 0.5,
            }}
          />
        </div>
      )}

      <p
        style={{
          fontSize: "13px",
          color: palette.text,
          margin: `${template.ornament ? 0 : baseSpacing * 1.5}px 0 0 0`,
          textAlign: "center",
          lineHeight: 1.8,
          maxWidth: "380px",
          whiteSpace: "pre-line",
        }}
      >
        {content.thankYouMessage}
      </p>

      <p
        style={{
          fontSize: "14px",
          color: palette.primary,
          fontWeight: 500,
          margin: `${baseSpacing * 1.5}px 0 0 0`,
          textAlign: "center",
          letterSpacing: "1px",
        }}
      >
        {content.name1}
        <span
          style={{
            display: "inline-block",
            margin: "0 10px",
            color: palette.accent,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "12px",
          }}
        >
          &amp;
        </span>
        {content.name2}
      </p>
    </div>
  );
}
