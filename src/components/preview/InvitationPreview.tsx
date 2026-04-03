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

function invitationLineForEvent(content: DesignContent): string {
  if (content.invitationLine?.trim()) return content.invitationLine.trim();
  return "invite you to celebrate with us";
}

function preHeadingForEvent(content: DesignContent): string {
  if (content.preHeading?.trim()) return content.preHeading.trim();
  return "Hosted by their loved ones";
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

/** Inner decorative frame — subtle inset line for elegance */
function InnerFrame({ color, style, padding }: { color: string; style: Template["ornamentStyle"]; padding: number }) {
  if (style === "minimal" || style === undefined) return null;

  const inset = padding * 0.35;
  const opacity = 0.18;

  if (style === "geometric" || style === "art-deco") {
    return (
      <div
        style={{
          position: "absolute",
          inset: `${inset}px`,
          border: `1px solid ${color}`,
          opacity,
          pointerEvents: "none",
        }}
      >
        {/* Corner squares for geometric styles */}
        {style === "art-deco" && (
          <>
            <div style={{ position: "absolute", top: -3, left: -3, width: 6, height: 6, backgroundColor: color, opacity: 0.4 }} />
            <div style={{ position: "absolute", top: -3, right: -3, width: 6, height: 6, backgroundColor: color, opacity: 0.4 }} />
            <div style={{ position: "absolute", bottom: -3, left: -3, width: 6, height: 6, backgroundColor: color, opacity: 0.4 }} />
            <div style={{ position: "absolute", bottom: -3, right: -3, width: 6, height: 6, backgroundColor: color, opacity: 0.4 }} />
          </>
        )}
      </div>
    );
  }

  if (style === "vintage" || style === "flourish") {
    return (
      <div
        style={{
          position: "absolute",
          inset: `${inset}px`,
          border: `1px solid ${color}`,
          opacity: opacity * 0.7,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "3px",
            border: `1px solid ${color}`,
            opacity: 0.5,
          }}
        />
      </div>
    );
  }

  // Classic, botanical, romantic — simple single inner frame
  return (
    <div
      style={{
        position: "absolute",
        inset: `${inset}px`,
        border: `1px solid ${color}`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}

/** Subtle corner flourishes using CSS */
function CornerAccents({ color, style }: { color: string; style: Template["ornamentStyle"] }) {
  if (style === "minimal" || style === undefined) return null;

  const cornerSize = style === "art-deco" ? 24 : style === "geometric" ? 18 : 20;
  const opacity = 0.25;

  const cornerBase: React.CSSProperties = {
    position: "absolute",
    width: cornerSize,
    height: cornerSize,
    opacity,
    pointerEvents: "none",
  };

  if (style === "botanical" || style === "romantic") {
    // Leaf-like curved corners
    return (
      <>
        <svg style={{ ...cornerBase, top: 8, left: 8 }} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1">
          <path d="M2 22 C2 12, 12 2, 22 2" />
          <path d="M2 18 C2 10, 10 2, 18 2" opacity="0.5" />
        </svg>
        <svg style={{ ...cornerBase, top: 8, right: 8, transform: "scaleX(-1)" }} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1">
          <path d="M2 22 C2 12, 12 2, 22 2" />
          <path d="M2 18 C2 10, 10 2, 18 2" opacity="0.5" />
        </svg>
        <svg style={{ ...cornerBase, bottom: 8, left: 8, transform: "scaleY(-1)" }} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1">
          <path d="M2 22 C2 12, 12 2, 22 2" />
          <path d="M2 18 C2 10, 10 2, 18 2" opacity="0.5" />
        </svg>
        <svg style={{ ...cornerBase, bottom: 8, right: 8, transform: "scale(-1)" }} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1">
          <path d="M2 22 C2 12, 12 2, 22 2" />
          <path d="M2 18 C2 10, 10 2, 18 2" opacity="0.5" />
        </svg>
      </>
    );
  }

  if (style === "art-deco") {
    // Stepped geometric corners
    return (
      <>
        <svg style={{ ...cornerBase, top: 6, left: 6, width: 30, height: 30 }} viewBox="0 0 30 30" fill="none" stroke={color} strokeWidth="1.2">
          <path d="M0 30 L0 12 L6 12 L6 6 L12 6 L12 0 L30 0" />
        </svg>
        <svg style={{ ...cornerBase, top: 6, right: 6, width: 30, height: 30, transform: "scaleX(-1)" }} viewBox="0 0 30 30" fill="none" stroke={color} strokeWidth="1.2">
          <path d="M0 30 L0 12 L6 12 L6 6 L12 6 L12 0 L30 0" />
        </svg>
        <svg style={{ ...cornerBase, bottom: 6, left: 6, width: 30, height: 30, transform: "scaleY(-1)" }} viewBox="0 0 30 30" fill="none" stroke={color} strokeWidth="1.2">
          <path d="M0 30 L0 12 L6 12 L6 6 L12 6 L12 0 L30 0" />
        </svg>
        <svg style={{ ...cornerBase, bottom: 6, right: 6, width: 30, height: 30, transform: "scale(-1)" }} viewBox="0 0 30 30" fill="none" stroke={color} strokeWidth="1.2">
          <path d="M0 30 L0 12 L6 12 L6 6 L12 6 L12 0 L30 0" />
        </svg>
      </>
    );
  }

  if (style === "flourish" || style === "vintage") {
    // Ornate scrollwork corners
    return (
      <>
        <svg style={{ ...cornerBase, top: 6, left: 6, width: 28, height: 28 }} viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1">
          <path d="M0 28 C0 14, 4 8, 8 4 C12 0, 14 0, 28 0" />
          <path d="M0 20 C4 12, 8 8, 20 0" opacity="0.4" />
          <circle cx="10" cy="10" r="1.5" fill={color} opacity="0.3" />
        </svg>
        <svg style={{ ...cornerBase, top: 6, right: 6, width: 28, height: 28, transform: "scaleX(-1)" }} viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1">
          <path d="M0 28 C0 14, 4 8, 8 4 C12 0, 14 0, 28 0" />
          <path d="M0 20 C4 12, 8 8, 20 0" opacity="0.4" />
          <circle cx="10" cy="10" r="1.5" fill={color} opacity="0.3" />
        </svg>
        <svg style={{ ...cornerBase, bottom: 6, left: 6, width: 28, height: 28, transform: "scaleY(-1)" }} viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1">
          <path d="M0 28 C0 14, 4 8, 8 4 C12 0, 14 0, 28 0" />
          <path d="M0 20 C4 12, 8 8, 20 0" opacity="0.4" />
          <circle cx="10" cy="10" r="1.5" fill={color} opacity="0.3" />
        </svg>
        <svg style={{ ...cornerBase, bottom: 6, right: 6, width: 28, height: 28, transform: "scale(-1)" }} viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1">
          <path d="M0 28 C0 14, 4 8, 8 4 C12 0, 14 0, 28 0" />
          <path d="M0 20 C4 12, 8 8, 20 0" opacity="0.4" />
          <circle cx="10" cy="10" r="1.5" fill={color} opacity="0.3" />
        </svg>
      </>
    );
  }

  // Classic, geometric — simple L-shaped corners
  return (
    <>
      {[
        { top: 8, left: 8 },
        { top: 8, right: 8, transform: "scaleX(-1)" as const },
        { bottom: 8, left: 8, transform: "scaleY(-1)" as const },
        { bottom: 8, right: 8, transform: "scale(-1)" as const },
      ].map((pos, i) => (
        <svg key={i} style={{ ...cornerBase, ...pos } as React.CSSProperties} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.2">
          <path d="M0 20 L0 0 L20 0" />
        </svg>
      ))}
    </>
  );
}

/** "Request the pleasure of your company" style subtitle */
function InvitationSubtext({ text, palette, font }: { text: string; palette: Palette; font: Font }) {
  return (
    <p
      style={{
        fontSize: "10px",
        letterSpacing: "3px",
        textTransform: "uppercase",
        color: palette.muted,
        margin: 0,
        fontWeight: font.category === "serif" ? 400 : 300,
      }}
    >
      {text}
    </p>
  );
}

export default function InvitationPreview({ template, palette, font, content }: PreviewProps) {
  const baseSpacing = 16 * template.spacingRatio;
  const textAlign = template.layout === "left" ? "left" as const : "center" as const;
  const ornStyle = template.ornamentStyle || "classic";
  const invitationLine = invitationLineForEvent(content);
  const preHeading = preHeadingForEvent(content);

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
        <InnerFrame color={palette.accent} style={ornStyle} padding={baseSpacing * 2.5} />
        <CornerAccents color={palette.accent} style={ornStyle} />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            paddingRight: `${baseSpacing * 1.5}px`,
            borderRight: `1px solid ${palette.muted}`,
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: palette.muted,
              margin: `0 0 ${baseSpacing}px 0`,
            }}
          >
            <span style={!content.preHeading ? { opacity: 0.4 } : undefined}>{preHeading}</span>
          </p>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: font.previewWeight,
              color: palette.primary,
              margin: "0 0 4px 0",
              lineHeight: 1.2,
              textAlign: "right",
              ...(!content.name1 ? { opacity: 0.4 } : {}),
            }}
          >
            {content.name1 || "Emma"}
          </h1>
          <span
            style={{
              fontSize: "16px",
              fontStyle: "italic",
              color: palette.accent,
              margin: `${baseSpacing * 0.4}px 0`,
              ...(!content.conjunction ? { opacity: 0.4 } : {}),
            }}
          >
            {content.conjunction || "&"}
          </span>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: font.previewWeight,
              color: palette.primary,
              margin: "4px 0 0 0",
              lineHeight: 1.2,
              textAlign: "right",
              ...(!content.name2 ? { opacity: 0.4 } : {}),
            }}
          >
            {content.name2 || "James"}
          </h1>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: `${baseSpacing * 1.5}px`,
            zIndex: 1,
          }}
        >
          <InvitationSubtext text="request the pleasure of your company" palette={palette} font={font} />
          <div style={{ height: baseSpacing * 0.8 }} />
          <p
            style={{
              fontSize: "14px",
              color: palette.text,
              margin: `0 0 ${baseSpacing * 0.3}px 0`,
              letterSpacing: "1px",
              fontWeight: 500,
            }}
          >
            <span style={!content.date ? { opacity: 0.4 } : undefined}>{content.date || "October 18, 2026"}</span>
          </p>
          <p
            style={{
              fontSize: "11px",
              color: palette.muted,
              margin: `0 0 ${baseSpacing * 0.8}px 0`,
              ...(!content.time ? { opacity: 0.4 } : {}),
            }}
          >
            {content.time || "Half past four"}
          </p>
          {template.ornament && <OrnamentalDivider style={ornStyle} color={palette.accent} size="sm" />}
          <p
            style={{
              fontSize: "13px",
              color: palette.primary,
              margin: `0 0 ${baseSpacing * 0.2}px 0`,
              fontWeight: 500,
              ...(!content.venue ? { opacity: 0.4 } : {}),
            }}
          >
            {content.venue || "The Grand Estate"}
          </p>
          <p
            style={{
              fontSize: "10px",
              color: palette.muted,
              margin: 0,
              lineHeight: 1.5,
              ...(!content.address ? { opacity: 0.4 } : {}),
            }}
          >
            {content.address || "123 Garden Lane"}
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
      <InnerFrame color={palette.accent} style={ornStyle} padding={baseSpacing * 2.5} />
      <CornerAccents color={palette.accent} style={ornStyle} />

      {/* Pre-heading */}
      <p
        style={{
          fontSize: "10px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: palette.muted,
          margin: `0 0 ${baseSpacing * 0.5}px 0`,
          textAlign,
          zIndex: 1,
        }}
      >
        <span style={!content.preHeading ? { opacity: 0.4 } : undefined}>{preHeading}</span>
      </p>

      {/* Spacer */}
      <div style={{ height: baseSpacing * 0.5 }} />

      {/* Name 1 */}
      <h1
        style={{
          fontSize: "30px",
          fontWeight: font.previewWeight,
          color: palette.primary,
          margin: "0 0 2px 0",
          lineHeight: 1.15,
          letterSpacing: font.category === "script" ? "0px" : "1px",
          textAlign,
          zIndex: 1,
          ...(!content.name1 ? { opacity: 0.4 } : {}),
        }}
      >
        {content.name1 || "Emma Rose"}
      </h1>

      {/* Conjunction */}
      <span
        style={{
          display: "block",
          fontSize: "16px",
          fontStyle: "italic",
          color: palette.accent,
          margin: `${baseSpacing * 0.5}px 0`,
          textAlign,
          zIndex: 1,
          ...(!content.conjunction ? { opacity: 0.4 } : {}),
        }}
      >
        {content.conjunction || "&"}
      </span>

      {/* Name 2 */}
      <h1
        style={{
          fontSize: "30px",
          fontWeight: font.previewWeight,
          color: palette.primary,
          margin: "2px 0 0 0",
          lineHeight: 1.15,
          letterSpacing: font.category === "script" ? "0px" : "1px",
          textAlign,
          zIndex: 1,
          ...(!content.name2 ? { opacity: 0.4 } : {}),
        }}
      >
        {content.name2 || "James William"}
      </h1>

      {/* Ornamental divider */}
      {template.ornament && (
        <div style={{ zIndex: 1 }}>
          <OrnamentalDivider style={ornStyle} color={palette.accent} />
        </div>
      )}

      {/* Invitation line */}
      <p
        style={{
          fontSize: "9px",
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: palette.muted,
          margin: `${baseSpacing * 0.8}px 0 ${baseSpacing * 1.2}px 0`,
          textAlign,
          zIndex: 1,
          opacity: 0.7,
        }}
      >
        {invitationLine}
      </p>

      {/* Date - hero element */}
      <p
        style={{
          fontSize: "14px",
          color: palette.text,
          margin: `0 0 ${baseSpacing * 0.3}px 0`,
          letterSpacing: "2px",
          textAlign,
          fontWeight: 500,
          zIndex: 1,
          ...(!content.date ? { opacity: 0.4 } : {}),
        }}
      >
        {content.date || "Saturday, October Eighteenth"}
      </p>

      {/* Time */}
      <p
        style={{
          fontSize: "11px",
          color: palette.muted,
          margin: `0 0 ${baseSpacing * 1.2}px 0`,
          textAlign,
          zIndex: 1,
          ...(!content.time ? { opacity: 0.4 } : {}),
        }}
      >
        {content.time || "Half past four in the afternoon"}
      </p>

      {/* Venue */}
      <p
        style={{
          fontSize: "13px",
          color: palette.primary,
          margin: `0 0 ${baseSpacing * 0.2}px 0`,
          fontWeight: 500,
          textAlign,
          letterSpacing: "0.5px",
          zIndex: 1,
          ...(!content.venue ? { opacity: 0.4 } : {}),
        }}
      >
        {content.venue || "The Grand Estate"}
      </p>

      {/* Address */}
      <p
        style={{
          fontSize: "10px",
          color: palette.muted,
          margin: 0,
          lineHeight: 1.5,
          textAlign,
          zIndex: 1,
          ...(!content.address ? { opacity: 0.4 } : {}),
        }}
      >
        {content.address || "123 Garden Lane, Napa Valley, California"}
      </p>
    </div>
  );
}
