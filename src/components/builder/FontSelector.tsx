"use client";

import React from "react";
import { useDesignStore } from "@/store/designStore";
import { fonts } from "@/data/fonts";
import Card from "@/components/ui/Card";

export default function FontSelector() {
  const { font: selected, setFont } = useDesignStore();

  const fontsImportUrl = fonts
    .map((f) => `family=${f.googleFontsFamily}`)
    .join("&");

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?${fontsImportUrl}&display=swap');`}</style>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fonts.map((f) => (
          <Card
            key={f.id}
            selected={selected.id === f.id}
            onClick={() => setFont(f)}
          >
            <p
              className="mb-2 text-xl"
              style={{
                fontFamily: `'${f.name}', ${f.category}`,
                fontWeight: f.previewWeight,
              }}
            >
              Alex &amp; Jordan
            </p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-stone-700">{f.name}</p>
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
                {f.category}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
