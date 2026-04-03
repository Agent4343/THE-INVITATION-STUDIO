"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import OrderStatus from "@/components/print/OrderStatus";

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
