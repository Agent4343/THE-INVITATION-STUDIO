"use client";

import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface OrderStatusData {
  status: "paid" | "printing" | "shipped" | "delivered";
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const steps: { key: OrderStatusData["status"]; label: string }[] = [
  { key: "paid", label: "Paid" },
  { key: "printing", label: "Printing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

function stepIndex(status: OrderStatusData["status"]): number {
  return steps.findIndex((s) => s.key === status);
}

interface OrderStatusProps {
  orderId: string;
}

export default function OrderStatus({ orderId }: OrderStatusProps) {
  const [data, setData] = useState<OrderStatusData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      try {
        const res = await fetch(`/api/print/status/${orderId}`);
        if (!res.ok) throw new Error("Failed to fetch order status");
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    }

    fetchStatus();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-center text-sm text-stone-500">
          Loading order status&hellip;
        </p>
      </div>
    );
  }

  const currentIdx = stepIndex(data.status);

  return (
    <div className="space-y-8">
      <h2 className="text-center font-serif text-xl text-stone-800">
        Order Status
      </h2>

      {/* Stepper / Timeline */}
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-stone-200" />
        <div
          className="absolute left-0 top-4 h-0.5 bg-stone-700 transition-all duration-500"
          style={{
            width:
              currentIdx === 0
                ? "0%"
                : `${(currentIdx / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-col items-center"
            >
              {/* Circle */}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors duration-300 ${
                  isCompleted
                    ? "border-stone-700 bg-stone-700 text-white"
                    : isCurrent
                      ? "border-stone-700 bg-white text-stone-700"
                      : "border-stone-300 bg-white text-stone-400"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
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

              {/* Label */}
              <span
                className={`mt-2 text-xs font-medium tracking-wide ${
                  isCompleted || isCurrent
                    ? "text-stone-800"
                    : "text-stone-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Details */}
      <div className="space-y-3 text-center">
        {data.trackingNumber && (
          <p className="text-sm text-stone-600">
            <span className="font-medium text-stone-800">Tracking:</span>{" "}
            {data.trackingNumber}
          </p>
        )}
        {data.estimatedDelivery && (
          <p className="text-sm text-stone-600">
            <span className="font-medium text-stone-800">
              Estimated Delivery:
            </span>{" "}
            {data.estimatedDelivery}
          </p>
        )}
      </div>
    </div>
  );
}
