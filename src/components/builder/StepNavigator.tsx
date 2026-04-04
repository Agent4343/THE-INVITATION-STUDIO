"use client";

import React from "react";
import { useDesignStore } from "@/store/designStore";
import Button from "@/components/ui/Button";
import type { BuilderStep } from "@/types";

const steps: { id: BuilderStep; label: string }[] = [
  { id: "template", label: "Stationery Style" },
  { id: "palette", label: "Colors" },
  { id: "font", label: "Typography" },
  { id: "content", label: "Event Details" },
  { id: "preview", label: "Review & Etsy Checkout" },
];

export default function StepNavigator({
  onDownload,
}: {
  onDownload?: () => void;
}) {
  const { currentStep, setCurrentStep } = useDesignStore();

  const currentIndex = steps.findIndex((s) => s.id === currentStep);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;

  const goNext = () => {
    if (isLast) {
      onDownload?.();
      return;
    }
    setCurrentStep(steps[currentIndex + 1].id);
  };

  const goPrev = () => {
    if (!isFirst) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  return (
    <div className="space-y-5">
      <nav className="grid grid-cols-5 gap-2">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = step.id === currentStep;

          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`rounded-lg border px-2 py-2 text-center transition-colors ${
                isCurrent
                  ? "border-stone-900 bg-stone-900 text-white"
                  : isCompleted
                    ? "border-stone-300 bg-stone-100 text-stone-700"
                    : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50"
              }`}
            >
              <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full border border-current text-[11px] font-semibold">
                {isCompleted ? (
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              <span className="text-[10px] font-medium leading-tight">
                {step.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="flex justify-between gap-3">
        <Button variant="secondary" onClick={goPrev} disabled={isFirst}>
          Previous
        </Button>
        <Button onClick={goNext}>
          {isLast ? "Go to Etsy Checkout" : "Continue Setup"}
        </Button>
      </div>
    </div>
  );
}
