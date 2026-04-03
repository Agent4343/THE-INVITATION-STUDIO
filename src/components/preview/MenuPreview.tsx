"use client";

import React from "react";
import type { Template, Palette, Font, DesignContent } from "@/types";
import { OrnamentalDivider, CourseDivider } from "./Ornaments";

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

export default function MenuPreview({ template, palette, font, content }: PreviewProps) {
  const baseSpacing = 16 * template.spacingRatio;
  const ornStyle = template.ornamentStyle || "classic";

  const courses = [
    { label: "First Course", item: content.appetizer, placeholder: "Seared Scallops with citrus beurre blanc" },
    { label: "Main Course", item: content.entree, placeholder: "Herb-Crusted Lamb with rosemary jus" },
    { label: "Dessert", item: content.dessert, placeholder: "Vanilla Bean Cr\u00e8me Br\u00fbl\u00e9e" },
  ];
  const menuHeading = content.menuHeading || "Menu";

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "5 / 7",
        backgroundColor: palette.bg,
        fontFamily: `"${font.name}", ${font.category}`,
        color: palette.text,
        padding: `${baseSpacing * 3}px ${baseSpacing * 2}px`,
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
            inset: `${baseSpacing * 0.9}px`,
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
        {menuHeading}
      </p>

      <h2
        style={{
          fontSize: "22px",
          fontWeight: font.previewWeight,
          color: palette.primary,
          letterSpacing: "5px",
          textTransform: "uppercase",
          margin: 0,
          textAlign: "center",
          zIndex: 1,
        }}
      >
        Menu
      </h2>

      {template.ornament && (
        <div style={{ margin: `${baseSpacing * 0.5}px 0 0 0`, zIndex: 1 }}>
          <OrnamentalDivider style={ornStyle} color={palette.accent} />
        </div>
      )}

      <div
        style={{
          marginTop: `${baseSpacing * 1.5}px`,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        {courses.map((course, index) => (
          <div key={course.label} style={{ width: "100%", textAlign: "center" }}>
            {index > 0 && <CourseDivider style={ornStyle} color={palette.accent} />}

            <p
              style={{
                fontSize: "9px",
                fontWeight: 600,
                color: palette.accent,
                letterSpacing: "3px",
                textTransform: "uppercase",
                margin: `0 0 ${baseSpacing * 0.3}px 0`,
              }}
            >
              {course.label}
            </p>

            <p
              style={{
                fontSize: "14px",
                color: palette.text,
                margin: 0,
                lineHeight: 1.6,
                fontStyle: "italic",
                ...(!course.item ? { opacity: 0.4 } : {}),
              }}
            >
              {course.item || course.placeholder}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
