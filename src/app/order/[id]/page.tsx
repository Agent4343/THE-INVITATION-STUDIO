"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function OrderStatus({ orderId }: { orderId: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-8 text-center">
      <p className="text-sm text-stone-500">
        Order tracking for <span className="font-mono font-semibold text-stone-700">{orderId}</span>
      </p>
      <p className="mt-4 text-sm text-stone-400">
        Order status tracking will be available once print ordering launches.
      </p>
    </div>
  );
}

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <header className="border-b border-stone-200 px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <h1
            className="text-xl font-semibold text-stone-800"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Order Status
          </h1>
          <Link
            href="/design"
            className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-800"
          >
            Back to Design
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <OrderStatus orderId={orderId} />
        </div>
      </main>
    </div>
  );
}
