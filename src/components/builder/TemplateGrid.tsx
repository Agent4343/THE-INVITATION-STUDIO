"use client";

import React from "react";
import { useDesignStore } from "@/store/designStore";
import { templates } from "@/data/templates";
import Card from "@/components/ui/Card";

export default function TemplateGrid() {
  const { template: selected, setTemplate } = useDesignStore();

  return (
    <div className="grid grid-cols-2 gap-4">
      {templates.map((t) => (
        <Card
          key={t.id}
          selected={selected.id === t.id}
          onClick={() => setTemplate(t)}
        >
          <div
            className="mb-3 flex aspect-[5/7] items-center justify-center rounded-md"
            style={{ backgroundColor: "#E8E4DE" }}
          >
            <span className="text-sm text-stone-400">Preview</span>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-stone-800">{t.name}</h3>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
              {t.layout}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
