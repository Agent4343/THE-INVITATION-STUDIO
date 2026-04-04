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

type MenuKind =
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

function normalizeMenuKind(value?: string): MenuKind {
  const v = (value || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
  if (v.includes("birthday")) return "birthday";
  if (v.includes("vow-renewal") || (v.includes("vow") && v.includes("renew"))) return "vow-renewal";
  if (v.includes("anniversary")) return "anniversary";
  if (v.includes("engagement")) return "engagement";
  if ((v.includes("baby") && v.includes("shower")) || v.includes("baby-shower")) return "baby-shower";
  if ((v.includes("bridal") && v.includes("shower")) || v.includes("bridal-shower")) return "bridal-shower";
  if (v.includes("graduation")) return "graduation";
  if (v.includes("retirement")) return "retirement";
  if (v.includes("holiday") || v.includes("christmas") || v.includes("new-year")) return "holiday-party";
  if (v.includes("corporate") || v.includes("company") || v.includes("team-event")) return "corporate-event";
  if (v.includes("elopement")) return "elopement";
  if (v.includes("civil-ceremony") || (v.includes("civil") && v.includes("ceremony"))) return "civil-ceremony";
  if (v.includes("wedding")) return "wedding";
  return "default";
}

function menuDefaultsForKind(kind: MenuKind): {
  heading: string;
  appetizer: string;
  entree: string;
  dessert: string;
} {
  switch (kind) {
    case "birthday":
      return {
        heading: "Birthday Menu",
        appetizer: "Mini Sliders & Crispy Fries",
        entree: "Build-Your-Own Taco Bar",
        dessert: "Birthday Cake & Ice Cream Bar",
      };
    case "anniversary":
      return {
        heading: "Anniversary Dinner",
        appetizer: "Burrata with Heirloom Tomatoes",
        entree: "Filet Mignon with Truffle Mash",
        dessert: "Champagne Tiramisu",
      };
    case "engagement":
      return {
        heading: "Engagement Soiree",
        appetizer: "Smoked Salmon Crostini",
        entree: "Lemon Herb Chicken",
        dessert: "Macaron Tower",
      };
    case "vow-renewal":
      return {
        heading: "Vow Renewal Dinner",
        appetizer: "Seasonal Bruschetta Trio",
        entree: "Roasted Salmon with Citrus Glaze",
        dessert: "Vanilla Bean Panna Cotta",
      };
    case "baby-shower":
      return {
        heading: "Shower Brunch",
        appetizer: "Fresh Fruit & Yogurt Parfaits",
        entree: "Quiche Lorraine & Garden Salad",
        dessert: "Cupcake Assortment",
      };
    case "bridal-shower":
      return {
        heading: "Bridal Shower Menu",
        appetizer: "Tea Sandwich Selection",
        entree: "Lemon Ricotta Pasta",
        dessert: "Strawberry Shortcake",
      };
    case "graduation":
      return {
        heading: "Graduation Feast",
        appetizer: "Buffalo Cauliflower Bites",
        entree: "BBQ Chicken and Cornbread",
        dessert: "Chocolate Brownie Sundaes",
      };
    case "retirement":
      return {
        heading: "Retirement Reception",
        appetizer: "Charcuterie and Artisan Cheese",
        entree: "Herb-Crusted Prime Rib",
        dessert: "Classic New York Cheesecake",
      };
    case "holiday-party":
      return {
        heading: "Holiday Party Menu",
        appetizer: "Seasonal Cranberry Brie Bites",
        entree: "Roast Turkey with Winter Vegetables",
        dessert: "Gingerbread Trifle",
      };
    case "corporate-event":
      return {
        heading: "Event Menu",
        appetizer: "Mediterranean Mezze Platter",
        entree: "Grilled Chicken with Wild Rice",
        dessert: "Chocolate Mousse Cups",
      };
    case "elopement":
      return {
        heading: "Celebration Dinner",
        appetizer: "Prosciutto & Fig Flatbread",
        entree: "Seared Sea Bass",
        dessert: "Lemon Tartlets",
      };
    case "civil-ceremony":
      return {
        heading: "Ceremony Reception Menu",
        appetizer: "Roasted Tomato Crostini",
        entree: "Chicken Piccata",
        dessert: "Berry Chantilly Cake",
      };
    case "wedding":
      return {
        heading: "Reception Menu",
        appetizer: "Burrata & Heirloom Tomato",
        entree: "Herb-Crusted Lamb",
        dessert: "Vanilla Bean Panna Cotta",
      };
    case "default":
    default:
      return {
        heading: "Event Menu",
        appetizer: "Seasonal Starter",
        entree: "Chef's Signature Entree",
        dessert: "House Dessert",
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

export default function MenuPreview({ template, palette, font, content }: PreviewProps) {
  const baseSpacing = 16 * template.spacingRatio;
  const ornStyle = template.ornamentStyle || "classic";
  const defaults = menuDefaultsForKind(normalizeMenuKind(content.eventType));

  const courses = [
    { label: "First Course", item: content.appetizer, placeholder: defaults.appetizer },
    { label: "Main Course", item: content.entree, placeholder: defaults.entree },
    { label: "Dessert", item: content.dessert, placeholder: defaults.dessert },
  ];
  const menuHeading = content.menuHeading || defaults.heading;

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
