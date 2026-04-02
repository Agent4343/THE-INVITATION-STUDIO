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

function OrnamentalDivider({ color }: { color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        margin: "20px 0",
        color,
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "60px",
          height: "1px",
          backgroundColor: color,
          opacity: 0.5,
        }}
      />
      <span style={{ fontSize: "10px", letterSpacing: "4px" }}>&#10022;</span>
      <span
        style={{
          display: "inline-block",
          width: "60px",
          height: "1px",
          backgroundColor: color,
          opacity: 0.5,
        }}
      />
    </div>
  );
}

export default function InvitationPreview({ template, palette, font, content }: PreviewProps) {
  const baseSpacing = 16 * template.spacingRatio;
  const textAlign = template.layout === "left" ? "left" as const : "center" as const;

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
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: palette.muted,
              margin: `0 0 ${baseSpacing}px 0`,
            }}
          >
            {content.preHeading}
          </p>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: font.previewWeight,
              color: palette.primary,
              margin: "0 0 6px 0",
              lineHeight: 1.2,
              textAlign: "right",
            }}
          >
            {content.name1}
          </h1>
          <span
            style={{
              fontSize: "16px",
              fontStyle: "italic",
              color: palette.accent,
              margin: `${baseSpacing * 0.5}px 0`,
            }}
          >
            {content.conjunction}
          </span>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: font.previewWeight,
              color: palette.primary,
              margin: "6px 0 0 0",
              lineHeight: 1.2,
              textAlign: "right",
            }}
          >
            {content.name2}
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
            }}
          >
            {content.date}
          </p>
          <p
            style={{
              fontSize: "12px",
              color: palette.muted,
              margin: `0 0 ${baseSpacing}px 0`,
            }}
          >
            {content.time}
          </p>
          {template.ornament && <OrnamentalDivider color={palette.accent} />}
          <p
            style={{
              fontSize: "14px",
              color: palette.primary,
              margin: `0 0 ${baseSpacing * 0.3}px 0`,
              fontWeight: 500,
            }}
          >
            {content.venue}
          </p>
          <p
            style={{
              fontSize: "11px",
              color: palette.muted,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {content.address}
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
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: palette.muted,
          margin: `0 0 ${baseSpacing * 1.5}px 0`,
          textAlign,
        }}
      >
        {content.preHeading}
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
        }}
      >
        {content.name1}
      </h1>

      <span
        style={{
          display: "block",
          fontSize: "18px",
          fontStyle: "italic",
          color: palette.accent,
          margin: `${baseSpacing * 0.75}px 0`,
          textAlign,
        }}
      >
        {content.conjunction}
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
        }}
      >
        {content.name2}
      </h1>

      {template.ornament && <OrnamentalDivider color={palette.accent} />}

      <p
        style={{
          fontSize: "15px",
          color: palette.text,
          margin: `${baseSpacing * 1.5}px 0 ${baseSpacing * 0.5}px 0`,
          letterSpacing: "2px",
          textAlign,
        }}
      >
        {content.date}
      </p>

      <p
        style={{
          fontSize: "12px",
          color: palette.muted,
          margin: `0 0 ${baseSpacing * 1.5}px 0`,
          textAlign,
        }}
      >
        {content.time}
      </p>

      <p
        style={{
          fontSize: "15px",
          color: palette.primary,
          margin: `0 0 ${baseSpacing * 0.3}px 0`,
          fontWeight: 500,
          textAlign,
        }}
      >
        {content.venue}
      </p>

      <p
        style={{
          fontSize: "11px",
          color: palette.muted,
          margin: 0,
          lineHeight: 1.6,
          textAlign,
        }}
      >
        {content.address}
      </p>
    </div>
  );
}
