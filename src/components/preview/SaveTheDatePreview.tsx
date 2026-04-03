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

export default function SaveTheDatePreview({ template, palette, font, content }: PreviewProps) {
  const baseSpacing = 16 * template.spacingRatio;
  const textAlign = template.layout === "left" ? "left" as const : "center" as const;
  const defaultSaveText =
    content.eventType && content.eventType.toLowerCase() !== "wedding"
      ? "Save the Date"
      : "Save the Date";
  const headingText = content.saveTheDateMessage || defaultSaveText;
  const hasCustomHeading = !!content.saveTheDateMessage;

  const containerStyle: React.CSSProperties = {
    width: "100%",
    aspectRatio: "5 / 7",
    backgroundColor: palette.bg,
    fontFamily: `"${font.name}", ${font.category}`,
    color: palette.text,
    padding: `${baseSpacing * 3}px ${baseSpacing * 2}px`,
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
              fontSize: "10px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: palette.accent,
              margin: `0 0 ${baseSpacing * 1.5}px 0`,
              textAlign: "right",
              ...(!hasCustomHeading ? { opacity: 0.4 } : {}),
            }}
          >
            {headingText}
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
              fontSize: "26px",
              fontWeight: font.previewWeight,
              color: palette.primary,
              margin: `0 0 ${baseSpacing}px 0`,
              lineHeight: 1.2,
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
              fontSize: "11px",
              color: palette.muted,
              margin: 0,
              lineHeight: 1.6,
              ...(!content.address ? { opacity: 0.4 } : {}),
            }}
          >
            {content.address || "Your Address"}
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
          fontSize: "11px",
          letterSpacing: "4px",
          textTransform: "uppercase",
          color: palette.accent,
          margin: `0 0 ${baseSpacing * 2}px 0`,
          textAlign,
          ...(!hasCustomHeading ? { opacity: 0.4 } : {}),
        }}
      >
        {headingText}
      </p>

      <h1
        style={{
          fontSize: "32px",
          fontWeight: font.previewWeight,
          color: palette.primary,
          margin: "0 0 4px 0",
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
          fontSize: "18px",
          fontStyle: "italic",
          color: palette.accent,
          margin: `${baseSpacing * 0.75}px 0`,
          textAlign,
          ...(!content.conjunction ? { opacity: 0.4 } : {}),
        }}
      >
        {content.conjunction || "&"}
      </span>

      <h1
        style={{
          fontSize: "32px",
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

      {template.ornament && <OrnamentalDivider style={template.ornamentStyle || "classic"} color={palette.accent} />}

      <p
        style={{
          fontSize: "28px",
          fontWeight: font.previewWeight,
          color: palette.primary,
          margin: `${baseSpacing * 1.5}px 0 ${baseSpacing * 0.5}px 0`,
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
          margin: `${baseSpacing}px 0 ${baseSpacing * 0.3}px 0`,
          fontWeight: 500,
          textAlign,
          ...(!content.venue ? { opacity: 0.4 } : {}),
        }}
      >
        {content.venue || "Your Venue"}
      </p>

      <p
        style={{
          fontSize: "11px",
          color: palette.muted,
          margin: 0,
          lineHeight: 1.6,
          textAlign,
          ...(!content.address ? { opacity: 0.4 } : {}),
        }}
      >
        {content.address || "Your Address"}
      </p>
    </div>
  );
}
