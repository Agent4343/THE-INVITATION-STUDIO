"use client";

import React from "react";

interface InputProps {
  label?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  className?: string;
  multiline?: boolean;
  maxLength?: number;
}

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  className = "",
  multiline = false,
  maxLength,
}: InputProps) {
  const inputId = label?.toLowerCase().replace(/\s+/g, '-');

  const sharedClasses = `
    w-full rounded-md border bg-white px-3.5 py-2.5
    text-stone-800 placeholder:text-stone-400
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400
    ${error ? "border-red-400 focus:ring-red-300 focus:border-red-400" : "border-stone-300"}
    ${className}
  `;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium tracking-wide text-stone-700">
          {label}
        </label>
      )}

      {multiline ? (
        <textarea
          id={inputId}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={4}
          className={`${sharedClasses} resize-y`}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={sharedClasses}
        />
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
