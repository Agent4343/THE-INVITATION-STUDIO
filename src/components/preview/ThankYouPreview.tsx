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

export default function ThankYouPreview({ template, palette, font, content }: PreviewProps) {
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
        padding: `${baseSpacing * 2}px ${baseSpacing * 2.5}px`,
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
          margin: `0 0 ${baseSpacing * 0.3}px 0`,
          textAlign: "center",
          opacity: 0.8,
          zIndex: 1,
        }}
      >
        With Gratitude
      </p>

      <h2
        style={{
          fontSize: "30px",
          fontWeight: font.previewWeight,
          color: palette.primary,
          margin: 0,
          textAlign: "center",
          lineHeight: 1.2,
          letterSpacing: "1px",
          zIndex: 1,
        }}
      >
        Thank You
      </h2>

      {template.ornament && (
        <div style={{ margin: `${baseSpacing * 0.5}px 0`, zIndex: 1 }}>
          <OrnamentalDivider style={ornStyle} color={palette.accent} size="sm" />
        </div>
      )}

      <p
        style={{
          fontSize: "12px",
          color: palette.text,
          margin: `${template.ornament ? 0 : baseSpacing}px 0 0 0`,
          textAlign: "center",
          lineHeight: 1.8,
          maxWidth: "360px",
          whiteSpace: "pre-line",
          zIndex: 1,
          ...(!content.thankYouMessage ? { opacity: 0.4 } : {}),
        }}
      >
        {content.thankYouMessage || "Thank you for sharing in our joy\nand celebrating this special day with us."}
      </p>

      {(content.name1 || content.name2) ? (
        <p
          style={{
            fontSize: "13px",
            color: palette.primary,
            fontWeight: 500,
            margin: `${baseSpacing}px 0 0 0`,
            textAlign: "center",
            letterSpacing: "1px",
            zIndex: 1,
          }}
        >
          {content.name1}
          {content.name1 && content.name2 && (
            <span
              style={{
                display: "inline-block",
                margin: "0 8px",
                color: palette.accent,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "11px",
              }}
            >
              &amp;
            </span>
          )}
          {content.name2}
        </p>
      ) : (
        <p
          style={{
            fontSize: "13px",
            color: palette.primary,
            fontWeight: 500,
            margin: `${baseSpacing}px 0 0 0`,
            textAlign: "center",
            letterSpacing: "1px",
            opacity: 0.4,
            zIndex: 1,
          }}
        >
          Your Event Hosts
        </p>
      )}
    </div>
  );
}
