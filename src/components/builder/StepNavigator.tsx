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
  { id: "preview", label: "Review & Export" },
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
    <div className="space-y-6">
      {/* Stepper bar */}
      <nav className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = step.id === currentStep;

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => setCurrentStep(step.id)}
                className="flex flex-col items-center gap-1"
              >
                <span
                  className={`
                    flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium
                    transition-colors duration-200
                    ${
                      isCurrent
                        ? "bg-stone-800 text-white"
                        : isCompleted
                          ? "bg-stone-600 text-white"
                          : "bg-stone-200 text-stone-500"
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="h-4 w-4"
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
                </span>
                <span
                  className={`text-xs font-medium ${
                    isCurrent
                      ? "text-stone-800"
                      : isCompleted
                        ? "text-stone-600"
                        : "text-stone-400"
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`mx-1 h-px flex-1 ${
                    idx < currentIndex ? "bg-stone-600" : "bg-stone-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Previous / Next buttons */}
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={goPrev}
          disabled={isFirst}
        >
          Previous
        </Button>
        <Button onClick={goNext}>
          {isLast ? "Go to Event Exports" : "Continue Setup"}
        </Button>
      </div>
    </div>
  );
}
