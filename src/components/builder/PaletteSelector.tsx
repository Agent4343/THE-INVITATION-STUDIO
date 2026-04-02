"use client";

import React from "react";
import { useDesignStore } from "@/store/designStore";
import { palettes } from "@/data/palettes";
import Card from "@/components/ui/Card";

export default function PaletteSelector() {
  const { palette: selected, setPalette } = useDesignStore();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {palettes.map((p) => (
        <Card
          key={p.id}
          selected={selected.id === p.id}
          onClick={() => setPalette(p)}
        >
          <div className="mb-2 flex gap-2">
            {[p.bg, p.primary, p.accent, p.text, p.muted].map(
              (color, idx) => (
                <span
                  key={idx}
                  className="inline-block h-6 w-6 rounded-full border border-stone-200"
                  style={{ backgroundColor: color }}
                />
              )
            )}
          </div>
          <p className="text-sm font-medium text-stone-700">{p.name}</p>
        </Card>
      ))}
    </div>
  );
}
