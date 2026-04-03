"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  selected = false,
  onClick,
}: CardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`
        relative rounded-lg border bg-white p-5 shadow-sm
        transition-all duration-200
        ${selected ? "border-stone-700 ring-2 ring-stone-600 shadow-md" : "border-stone-200"}
        ${onClick ? "cursor-pointer hover:shadow-md hover:border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400" : ""}
        ${className}
      `}
    >
      {selected && (
        <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-stone-700 text-white text-xs leading-none">
          ✓
        </div>
      )}
      {children}
    </div>
  );
}
