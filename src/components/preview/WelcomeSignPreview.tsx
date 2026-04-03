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

export default function WelcomeSignPreview({ template, palette, font, content }: PreviewProps) {
  const baseSpacing = 16 * template.spacingRatio;
  const textAlign = template.layout === "left" ? "left" as const : "center" as const;
  const welcomeFallback = "Welcome to our Event";

  const containerStyle: React.CSSProperties = {
    width: "100%",
    aspectRatio: "3 / 4",
    backgroundColor: palette.bg,
    fontFamily: `"${font.name}", ${font.category}`,
    color: palette.text,
    padding: `${baseSpacing * 4}px ${baseSpacing * 2.5}px`,
    boxSizing: "border-box",
    display: "flex",
    position: "relative",
    overflow: "hidden",
    ...getBorderStyle(template.borderStyle, palette.muted),
  };

  if (template.layout === "split") {
    return (
      <div style={containerStyle}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            paddingRight: `${baseSpacing * 1.5}px`,
            borderRight: `1px solid ${palette.muted}`,
          }}
        >
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: palette.accent,
              margin: `0 0 ${baseSpacing * 1.5}px 0`,
              textAlign: "right",
              ...(!content.welcomeMessage ? { opacity: 0.4 } : {}),
            }}
          >
            {content.welcomeMessage || welcomeFallback}
          </p>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: font.previewWeight,
              color: palette.primary,
              margin: "0 0 6px 0",
              lineHeight: 1.2,
              textAlign: "right",
              ...(!content.name1 ? { opacity: 0.4 } : {}),
            }}
          >
            {content.name1 || "Your Name"}
          </h1>
          <span
            style={{
              fontSize: "16px",
              fontStyle: "italic",
              color: palette.accent,
              margin: `${baseSpacing * 0.5}px 0`,
              ...(!content.conjunction ? { opacity: 0.4 } : {}),
            }}
          >
            {content.conjunction || "&"}
          </span>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: font.previewWeight,
              color: palette.primary,
              margin: "6px 0 0 0",
              lineHeight: 1.2,
              textAlign: "right",
              ...(!content.name2 ? { opacity: 0.4 } : {}),
            }}
          >
            {content.name2 || "Partner's Name"}
          </h1>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: `${baseSpacing * 1.5}px`,
          }}
        >
          <p
            style={{
              fontSize: "15px",
              color: palette.text,
              margin: `0 0 ${baseSpacing * 0.5}px 0`,
              letterSpacing: "1px",
              ...(!content.date ? { opacity: 0.4 } : {}),
            }}
          >
            {content.date || "Your Date"}
          </p>
          {template.ornament && <OrnamentalDivider style={template.ornamentStyle || "classic"} color={palette.accent} />}
          <p
            style={{
              fontSize: "14px",
              color: palette.primary,
              margin: `0 0 ${baseSpacing * 0.3}px 0`,
              fontWeight: 500,
              ...(!content.venue ? { opacity: 0.4 } : {}),
            }}
          >
            {content.venue || "Your Venue"}
          </p>
          <p
            style={{
              fontSize: "12px",
              fontStyle: "italic",
              color: palette.muted,
              margin: `${baseSpacing}px 0 0 0`,
              lineHeight: 1.6,
              ...(!content.welcomeSubtext ? { opacity: 0.4 } : {}),
            }}
          >
            {content.welcomeSubtext || "Please find your seat"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...containerStyle,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: template.layout === "left" ? "flex-start" : "center",
      }}
    >
      <p
        style={{
          fontSize: "12px",
          letterSpacing: "4px",
          textTransform: "uppercase",
          color: palette.accent,
          margin: `0 0 ${baseSpacing * 2}px 0`,
          textAlign,
          ...(!content.welcomeMessage ? { opacity: 0.4 } : {}),
        }}
      >
        {content.welcomeMessage || welcomeFallback}
      </p>

      {template.ornament && <OrnamentalDivider style={template.ornamentStyle || "classic"} color={palette.accent} />}

      <h1
        style={{
          fontSize: "36px",
          fontWeight: font.previewWeight,
          color: palette.primary,
          margin: `${baseSpacing}px 0 4px 0`,
          lineHeight: 1.2,
          letterSpacing: "1px",
          textAlign,
          ...(!content.name1 ? { opacity: 0.4 } : {}),
        }}
      >
        {content.name1 || "Your Name"}
      </h1>

      <span
        style={{
          display: "block",
          fontSize: "20px",
          fontStyle: "italic",
          color: palette.accent,
          margin: `${baseSpacing}px 0`,
          textAlign,
          ...(!content.conjunction ? { opacity: 0.4 } : {}),
        }}
      >
        {content.conjunction || "&"}
      </span>

      <h1
        style={{
          fontSize: "36px",
          fontWeight: font.previewWeight,
          color: palette.primary,
          margin: "4px 0 0 0",
          lineHeight: 1.2,
          letterSpacing: "1px",
          textAlign,
          ...(!content.name2 ? { opacity: 0.4 } : {}),
        }}
      >
        {content.name2 || "Partner's Name"}
      </h1>

      <p
        style={{
          fontSize: "16px",
          color: palette.text,
          margin: `${baseSpacing * 2}px 0 ${baseSpacing * 0.5}px 0`,
          letterSpacing: "2px",
          textAlign,
          ...(!content.date ? { opacity: 0.4 } : {}),
        }}
      >
        {content.date || "Your Date"}
      </p>

      <p
        style={{
          fontSize: "15px",
          color: palette.primary,
          margin: `${baseSpacing * 0.5}px 0 ${baseSpacing * 0.3}px 0`,
          fontWeight: 500,
          textAlign,
          ...(!content.venue ? { opacity: 0.4 } : {}),
        }}
      >
        {content.venue || "Your Venue"}
      </p>

      {template.ornament && <OrnamentalDivider style={template.ornamentStyle || "classic"} color={palette.accent} size="sm" />}

      <p
        style={{
          fontSize: "13px",
          fontStyle: "italic",
          color: palette.muted,
          margin: `${baseSpacing}px 0 0 0`,
          lineHeight: 1.6,
          textAlign,
          ...(!content.welcomeSubtext ? { opacity: 0.4 } : {}),
        }}
      >
        {content.welcomeSubtext || "Please find your seat"}
      </p>
    </div>
  );
}
