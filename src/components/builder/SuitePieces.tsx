"use client";

import React from "react";
import { useDesignStore } from "@/store/designStore";
import type { SuitePiece } from "@/types";

const pieces: { id: SuitePiece; label: string }[] = [
  { id: "invitation", label: "Main Invitation" },
  { id: "rsvp", label: "RSVP" },
  { id: "details", label: "Details" },
  { id: "menu", label: "Menu" },
  { id: "thankyou", label: "Thank You" },
  { id: "savethedate", label: "Save the Date" },
  { id: "tablenumber", label: "Table No." },
  { id: "placecard", label: "Place Card" },
  { id: "welcomesign", label: "Welcome Sign" },
];

export default function SuitePieces() {
  const { activePiece, setActivePiece } = useDesignStore();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {pieces.map((piece) => (
        <button
          key={piece.id}
          onClick={() => setActivePiece(piece.id)}
          className={`
            whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium
            transition-colors duration-200
            ${
              activePiece === piece.id
                ? "bg-stone-800 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }
          `}
        >
          {piece.label}
        </button>
      ))}
    </div>
  );
}
