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

type EventKind =
  | "birthday"
  | "anniversary"
  | "engagement"
  | "vow-renewal"
  | "baby-shower"
  | "bridal-shower"
  | "graduation"
  | "retirement"
  | "holiday-party"
  | "corporate-event"
  | "elopement"
  | "civil-ceremony"
  | "wedding"
  | "default";

function normalizeEventType(value?: string): string {
  return (value || "celebration")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
}

function normalizeEventKind(value?: string): EventKind {
  const eventType = normalizeEventType(value);
  if (eventType.includes("birthday")) return "birthday";
  if (eventType.includes("vow-renewal") || (eventType.includes("vow") && eventType.includes("renew"))) {
    return "vow-renewal";
  }
  if (eventType.includes("anniversary")) return "anniversary";
  if (eventType.includes("engagement")) return "engagement";
  if ((eventType.includes("baby") && eventType.includes("shower")) || eventType.includes("baby-shower")) {
    return "baby-shower";
  }
  if ((eventType.includes("bridal") && eventType.includes("shower")) || eventType.includes("bridal-shower")) {
    return "bridal-shower";
  }
  if (eventType.includes("graduation")) return "graduation";
  if (eventType.includes("retirement")) return "retirement";
  if (eventType.includes("holiday") || eventType.includes("christmas") || eventType.includes("new-year")) {
    return "holiday-party";
  }
  if (eventType.includes("corporate") || eventType.includes("company") || eventType.includes("team-event")) {
    return "corporate-event";
  }
  if (eventType.includes("elopement")) return "elopement";
  if (eventType.includes("civil-ceremony") || (eventType.includes("civil") && eventType.includes("ceremony"))) {
    return "civil-ceremony";
  }
  if (eventType.includes("wedding")) return "wedding";
  return "default";
}

function invitationLineForEvent(content: DesignContent): string {
  if (content.invitationLine?.trim()) return content.invitationLine.trim();
  switch (normalizeEventKind(content.eventType)) {
    case "birthday":
      return "invite you to a birthday celebration";
    case "anniversary":
      return "invite you to celebrate our anniversary";
    case "engagement":
      return "invite you to celebrate our engagement";
    case "vow-renewal":
      return "invite you to celebrate our vow renewal";
    case "baby-shower":
      return "invite you to a baby shower celebration";
    case "bridal-shower":
      return "invite you to a bridal shower celebration";
    case "graduation":
      return "invite you to celebrate this graduation";
    case "retirement":
      return "invite you to celebrate a retirement";
    case "holiday-party":
      return "invite you to our holiday party";
    case "corporate-event":
      return "invite you to our corporate celebration";
    case "elopement":
      return "invite you to celebrate our elopement";
    case "civil-ceremony":
      return "invite you to celebrate our civil ceremony";
    default:
      return "invite you to celebrate with us";
  }
}

function preHeadingForEvent(content: DesignContent): string {
  if (content.preHeading?.trim()) return content.preHeading.trim();
  switch (normalizeEventKind(content.eventType)) {
    case "birthday":
      return "Join us for a birthday celebration";
    case "anniversary":
    case "vow-renewal":
    case "engagement":
    case "civil-ceremony":
      return "Together with our loved ones";
    case "baby-shower":
    case "bridal-shower":
      return "Hosted with love";
    case "holiday-party":
      return "You're invited to celebrate the season";
    case "corporate-event":
      return "You're invited";
    case "elopement":
      return "A small celebration with those we love";
    default:
      return "Hosted by friends and family";
  }
}

function sampleInvitationDefaults(content: DesignContent): {
  name1: string;
  name2: string;
  date: string;
  time: string;
  venue: string;
  address: string;
} {
  switch (normalizeEventKind(content.eventType)) {
    case "birthday":
      return {
        name1: "Alex",
        name2: "Jordan",
        date: "Saturday, October 18, 2026",
        time: "6:00 PM",
        venue: "Celebration Hall",
        address: "123 Celebration Lane, Your City, ST",
      };
    case "anniversary":
      return {
        name1: "Alex",
        name2: "Jordan",
        date: "Saturday, October 18, 2026",
        time: "5:00 PM",
        venue: "Anniversary House",
        address: "456 Memory Lane, Your City, ST",
      };
    case "engagement":
      return {
        name1: "Avery",
        name2: "Cameron",
        date: "Saturday, May 8, 2027",
        time: "5:30 PM",
        venue: "Riverside Loft",
        address: "25 Harbor Street, Your City, ST",
      };
    case "vow-renewal":
      return {
        name1: "Avery",
        name2: "Cameron",
        date: "Sunday, August 22, 2027",
        time: "4:00 PM",
        venue: "Sunset Garden",
        address: "18 Willow Avenue, Your City, ST",
      };
    case "baby-shower":
      return {
        name1: "Taylor",
        name2: "Morgan",
        date: "Sunday, October 19, 2026",
        time: "11:00 AM",
        venue: "Garden Room",
        address: "789 Blossom Street, Your City, ST",
      };
    case "bridal-shower":
      return {
        name1: "Taylor",
        name2: "Riley",
        date: "Saturday, October 18, 2026",
        time: "1:00 PM",
        venue: "Rosewood Lounge",
        address: "321 Rose Avenue, Your City, ST",
      };
    case "graduation":
      return {
        name1: "Jordan",
        name2: "Family & Friends",
        date: "Saturday, June 12, 2027",
        time: "2:00 PM",
        venue: "Main Auditorium",
        address: "200 University Way, Your City, ST",
      };
    case "retirement":
      return {
        name1: "Alex",
        name2: "Colleagues & Friends",
        date: "Friday, September 10, 2027",
        time: "6:30 PM",
        venue: "Banquet Hall",
        address: "100 Heritage Drive, Your City, ST",
      };
    case "holiday-party":
      return {
        name1: "The Rivera Family",
        name2: "Friends & Neighbors",
        date: "Saturday, December 12, 2026",
        time: "7:00 PM",
        venue: "Winter Hall",
        address: "90 Evergreen Avenue, Your City, ST",
      };
    case "corporate-event":
      return {
        name1: "Horizon Team",
        name2: "Clients & Partners",
        date: "Thursday, November 4, 2027",
        time: "6:00 PM",
        venue: "City Conference Center",
        address: "410 Commerce Plaza, Your City, ST",
      };
    case "elopement":
      return {
        name1: "Avery",
        name2: "Cameron",
        date: "Friday, July 16, 2027",
        time: "4:00 PM",
        venue: "Cliffside Terrace",
        address: "12 Seaview Point, Your City, ST",
      };
    case "civil-ceremony":
      return {
        name1: "Avery",
        name2: "Cameron",
        date: "Friday, June 18, 2027",
        time: "3:30 PM",
        venue: "City Hall Atrium",
        address: "1 Municipal Square, Your City, ST",
      };
    case "wedding":
    case "default":
    default:
      return {
        name1: "Alex",
        name2: "Jordan",
        date: "Saturday, October 18, 2026",
        time: "4:30 PM",
        venue: "Celebration Hall",
        address: "123 Celebration Lane, Your City, ST",
      };
  }
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
  const defaults = sampleInvitationDefaults(content);

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
            {content.name1 || defaults.name1}
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
            {content.name2 || defaults.name2}
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
          <InvitationSubtext text={invitationLine} palette={palette} font={font} />
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
            <span style={!content.date ? { opacity: 0.4 } : undefined}>{content.date || defaults.date}</span>
          </p>
          <p
            style={{
              fontSize: "11px",
              color: palette.muted,
              margin: `0 0 ${baseSpacing * 0.8}px 0`,
              ...(!content.time ? { opacity: 0.4 } : {}),
            }}
          >
            {content.time || defaults.time}
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
            {content.venue || defaults.venue}
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
            {content.address || defaults.address}
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
        {content.name1 || defaults.name1}
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
        {content.name2 || defaults.name2}
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
        {content.date || defaults.date}
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
        {content.time || defaults.time}
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
        {content.venue || defaults.venue}
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
        {content.address || defaults.address}
      </p>
    </div>
  );
}
