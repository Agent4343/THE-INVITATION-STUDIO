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
  return (
    <div
      onClick={onClick}
      className={`
        rounded-lg border bg-white p-5 shadow-sm
        transition-all duration-200
        ${selected ? "border-stone-600 ring-2 ring-stone-400" : "border-stone-200"}
        ${onClick ? "cursor-pointer hover:shadow-md hover:border-stone-300" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
