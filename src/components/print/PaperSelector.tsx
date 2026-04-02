"use client";

import React from "react";
import Card from "@/components/ui/Card";

export type PaperStock = "standard" | "premium" | "cotton";

interface PaperOption {
  value: PaperStock;
  label: string;
  description: string;
  surcharge: string | null;
}

const paperOptions: PaperOption[] = [
  {
    value: "standard",
    label: "Smooth Matte",
    description: "100lb cover",
    surcharge: null,
  },
  {
    value: "premium",
    label: "Textured Linen",
    description: "120lb cover",
    surcharge: "+$0.25/card",
  },
  {
    value: "cotton",
    label: "Luxe Cotton",
    description: "130lb cover",
    surcharge: "+$0.50/card",
  },
];

interface PaperSelectorProps {
  value: PaperStock;
  onChange: (stock: PaperStock) => void;
}

export default function PaperSelector({ value, onChange }: PaperSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium uppercase tracking-widest text-stone-500">
        Paper Stock
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {paperOptions.map((option) => (
          <Card
            key={option.value}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
            className="text-center"
          >
            <p className="font-semibold text-stone-800">{option.label}</p>
            <p className="mt-1 text-sm text-stone-500">{option.description}</p>
            {option.surcharge ? (
              <p className="mt-2 text-xs font-medium text-stone-600">
                {option.surcharge}
              </p>
            ) : (
              <p className="mt-2 text-xs font-medium text-stone-400">
                Included
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
