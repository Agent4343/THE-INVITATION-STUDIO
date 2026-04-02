"use client";

import React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-stone-800 text-white hover:bg-stone-700 active:bg-stone-900 border border-stone-800",
  secondary:
    "bg-transparent text-stone-700 border border-stone-300 hover:border-stone-500 hover:text-stone-900 active:bg-stone-50",
  ghost:
    "bg-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100 active:bg-stone-200 border border-transparent",
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2 text-sm",
  lg: "px-7 py-3 text-base",
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-md font-medium tracking-wide
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
}
