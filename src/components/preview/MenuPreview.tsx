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

function CourseDivider({ color }: { color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        margin: "20px auto",
        width: "60%",
      }}
    >
      <span
        style={{
          flex: 1,
          height: "1px",
          backgroundColor: color,
          opacity: 0.25,
        }}
      />
      <span style={{ color, fontSize: "6px", opacity: 0.5 }}>&#9830;</span>
      <span
        style={{
          flex: 1,
          height: "1px",
          backgroundColor: color,
          opacity: 0.25,
        }}
      />
    </div>
  );
}

export default function MenuPreview({ template, palette, font, content }: PreviewProps) {
  const baseSpacing = 16 * template.spacingRatio;

  const courses = [
    { label: "First Course", item: content.appetizer },
    { label: "Main Course", item: content.entree },
    { label: "Dessert", item: content.dessert },
  ].filter((c) => c.item);

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
      <h2
        style={{
          fontSize: "24px",
          fontWeight: font.previewWeight,
          color: palette.primary,
          letterSpacing: "5px",
          textTransform: "uppercase",
          margin: 0,
          textAlign: "center",
        }}
      >
        Dinner Menu
      </h2>

      {template.ornament && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            margin: `${baseSpacing}px 0 0 0`,
            color: palette.accent,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "50px",
              height: "1px",
              backgroundColor: palette.accent,
              opacity: 0.5,
            }}
          />
          <span style={{ fontSize: "10px", letterSpacing: "4px" }}>&#10022;</span>
          <span
            style={{
              display: "inline-block",
              width: "50px",
              height: "1px",
              backgroundColor: palette.accent,
              opacity: 0.5,
            }}
          />
        </div>
      )}

      <div
        style={{
          marginTop: `${baseSpacing * 2}px`,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {courses.map((course, index) => (
          <div key={course.label} style={{ width: "100%", textAlign: "center" }}>
            {index > 0 && <CourseDivider color={palette.accent} />}

            <p
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: palette.accent,
                letterSpacing: "3px",
                textTransform: "uppercase",
                margin: `0 0 ${baseSpacing * 0.4}px 0`,
              }}
            >
              {course.label}
            </p>

            <p
              style={{
                fontSize: "15px",
                color: palette.text,
                margin: 0,
                lineHeight: 1.6,
                fontStyle: "italic",
              }}
            >
              {course.item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
