"use client";

import React from "react";
import { useDesignStore } from "@/store/designStore";
import type { SuitePiece } from "@/types";

const pieces: { id: SuitePiece; label: string }[] = [
  { id: "invitation", label: "Main Event Invite" },
  { id: "rsvp", label: "RSVP" },
  { id: "details", label: "Event Details" },
  { id: "menu", label: "Event Menu" },
  { id: "thankyou", label: "Thank You" },
  { id: "savethedate", label: "Save the Date" },
  { id: "tablenumber", label: "Table Number" },
  { id: "placecard", label: "Guest Place Card" },
  { id: "welcomesign", label: "Event Welcome Sign" },
];

export default function SuitePieces() {
  const { activePiece, setActivePiece } = useDesignStore();

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
        Preview Piece
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
      {pieces.map((piece) => (
        <button
          key={piece.id}
          onClick={() => setActivePiece(piece.id)}
          className={`
            whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium
            transition-colors duration-200
            ${
              activePiece === piece.id
                ? "border-stone-800 bg-stone-800 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:bg-stone-100"
            }
          `}
        >
          {piece.label}
        </button>
      ))}
      </div>
    </div>
  );
}
