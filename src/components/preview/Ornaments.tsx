"use client";

import React from "react";
import type { Template } from "@/types";

interface OrnamentProps {
  style: Template["ornamentStyle"];
  color: string;
  size?: "sm" | "md" | "lg";
}

export function OrnamentalDivider({ style, color, size = "md" }: OrnamentProps) {
  const lineWidth = size === "sm" ? "30px" : size === "lg" ? "70px" : "50px";
  const fontSize = size === "sm" ? "8px" : size === "lg" ? "14px" : "10px";
  const margin = size === "sm" ? "12px 0" : size === "lg" ? "24px 0" : "18px 0";

  const lineStyle: React.CSSProperties = {
    display: "inline-block",
    width: lineWidth,
    height: "1px",
    backgroundColor: color,
    opacity: 0.4,
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    margin,
    color,
  };

  switch (style) {
    case "botanical":
      return (
        <div style={containerStyle}>
          <span style={lineStyle} />
          <span style={{ fontSize, letterSpacing: "6px", opacity: 0.7 }}>&#9753; &#10047; &#9753;</span>
          <span style={lineStyle} />
        </div>
      );

    case "geometric":
      return (
        <div style={containerStyle}>
          <span style={{ ...lineStyle, height: "2px", opacity: 0.3 }} />
          <span style={{ fontSize, letterSpacing: "4px" }}>&#9670; &#9671; &#9670;</span>
          <span style={{ ...lineStyle, height: "2px", opacity: 0.3 }} />
        </div>
      );

    case "art-deco":
      return (
        <div style={containerStyle}>
          <span style={{ ...lineStyle, width: size === "sm" ? "20px" : "40px" }} />
          <span style={{ fontSize: size === "sm" ? "10px" : "14px", letterSpacing: "3px" }}>&#9001; &#9674; &#9002;</span>
          <span style={{ ...lineStyle, width: size === "sm" ? "20px" : "40px" }} />
        </div>
      );

    case "minimal":
      return (
        <div style={containerStyle}>
          <span style={{ ...lineStyle, width: size === "sm" ? "40px" : "80px", opacity: 0.25 }} />
        </div>
      );

    case "flourish":
      return (
        <div style={containerStyle}>
          <span style={{ fontSize: size === "sm" ? "12px" : "16px", opacity: 0.6, transform: "scaleX(-1)" }}>&#10087;</span>
          <span style={{ ...lineStyle, opacity: 0.3 }} />
          <span style={{ fontSize: size === "sm" ? "6px" : "8px", letterSpacing: "4px" }}>&#10022;</span>
          <span style={{ ...lineStyle, opacity: 0.3 }} />
          <span style={{ fontSize: size === "sm" ? "12px" : "16px", opacity: 0.6 }}>&#10087;</span>
        </div>
      );

    case "vintage":
      return (
        <div style={containerStyle}>
          <span style={{ fontSize: size === "sm" ? "10px" : "14px", opacity: 0.5 }}>&#10048;</span>
          <span style={{ ...lineStyle, borderTop: `1px dotted ${color}`, height: 0, backgroundColor: "transparent", opacity: 0.4 }} />
          <span style={{ fontSize: size === "sm" ? "6px" : "8px", letterSpacing: "4px" }}>&#10047;</span>
          <span style={{ ...lineStyle, borderTop: `1px dotted ${color}`, height: 0, backgroundColor: "transparent", opacity: 0.4 }} />
          <span style={{ fontSize: size === "sm" ? "10px" : "14px", opacity: 0.5 }}>&#10048;</span>
        </div>
      );

    case "romantic":
      return (
        <div style={containerStyle}>
          <span style={lineStyle} />
          <span style={{ fontSize: size === "sm" ? "10px" : "14px", opacity: 0.6 }}>&#10084;</span>
          <span style={lineStyle} />
        </div>
      );

    case "classic":
    default:
      return (
        <div style={containerStyle}>
          <span style={lineStyle} />
          <span style={{ fontSize, letterSpacing: "4px" }}>&#10022;</span>
          <span style={lineStyle} />
        </div>
      );
  }
}

export function SectionDivider({ style, color }: { style: Template["ornamentStyle"]; color: string }) {
  return <OrnamentalDivider style={style} color={color} size="sm" />;
}

export function CourseDivider({ style, color }: { style: Template["ornamentStyle"]; color: string }) {
  switch (style) {
    case "geometric":
    case "art-deco":
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", margin: "16px auto", width: "60%" }}>
          <span style={{ flex: 1, height: "2px", backgroundColor: color, opacity: 0.2 }} />
          <span style={{ color, fontSize: "6px" }}>&#9670;</span>
          <span style={{ flex: 1, height: "2px", backgroundColor: color, opacity: 0.2 }} />
        </div>
      );
    case "botanical":
    case "romantic":
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", margin: "16px auto", width: "60%" }}>
          <span style={{ flex: 1, height: "1px", backgroundColor: color, opacity: 0.2 }} />
          <span style={{ color, fontSize: "8px", opacity: 0.5 }}>&#10047;</span>
          <span style={{ flex: 1, height: "1px", backgroundColor: color, opacity: 0.2 }} />
        </div>
      );
    default:
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", margin: "16px auto", width: "60%" }}>
          <span style={{ flex: 1, height: "1px", backgroundColor: color, opacity: 0.25 }} />
          <span style={{ color, fontSize: "6px", opacity: 0.5 }}>&#9830;</span>
          <span style={{ flex: 1, height: "1px", backgroundColor: color, opacity: 0.25 }} />
        </div>
      );
  }
}
