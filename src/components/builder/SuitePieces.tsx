"use client";

import React from "react";
import { useDesignStore } from "@/store/designStore";
import type { SuitePiece } from "@/types";

const pieces: { id: SuitePiece; label: string }[] = [
  { id: "invitation", label: "Invitation" },
  { id: "rsvp", label: "RSVP" },
  { id: "details", label: "Details" },
  { id: "menu", label: "Menu" },
  { id: "thankyou", label: "Thank You" },
];

export default function SuitePieces() {
  const { activePiece, setActivePiece } = useDesignStore();

  return (
    <div className="flex flex-wrap gap-2">
      {pieces.map((piece) => (
        <button
          key={piece.id}
          onClick={() => setActivePiece(piece.id)}
          className={`
            rounded-full px-4 py-1.5 text-sm font-medium
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
