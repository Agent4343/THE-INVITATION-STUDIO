"use client";

import React, { useState } from "react";
import { useDesignStore } from "@/store/designStore";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PaperSelector, { type PaperStock } from "./PaperSelector";

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: string;
}

const tiers: PricingTier[] = [
  {
    id: "essential",
    name: "Essential",
    description: "50 invitations + 50 RSVP cards",
    price: "$49.99",
  },
  {
    id: "classic",
    name: "Classic",
    description: "100 invitations + 100 RSVP cards",
    price: "$79.99",
  },
  {
    id: "complete",
    name: "Complete Suite",
    description: "100 of all 5 pieces",
    price: "$149.99",
  },
];

export default function PrintOffer() {
  const designId = useDesignStore((s) => s.designId);
  const [selectedTier, setSelectedTier] = useState<string>("classic");
  const [paperStock, setPaperStock] = useState<PaperStock>("standard");
  const [isOrdering, setIsOrdering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleOrder() {
    if (!designId) return;

    setIsOrdering(true);
    setError(null);

    try {
      const res = await fetch("/api/print/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designId,
          tier: selectedTier,
          paperStock,
          shippingAddress: {
            name: "Collected at checkout",
            line1: "",
            city: "",
            state: "",
            postalCode: "",
            country: "US",
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");

      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsOrdering(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-10 py-12 text-center">
      {/* Headline */}
      <div className="space-y-2">
        <h2 className="font-serif text-3xl tracking-tight text-stone-800">
          Want these professionally printed?
        </h2>
        <p className="text-sm text-stone-500">
          Museum-quality printing on your choice of luxe paper stock, delivered
          to your door.
        </p>
      </div>

      {/* Pricing tiers */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            selected={selectedTier === tier.id}
            onClick={() => setSelectedTier(tier.id)}
            className="flex flex-col items-center justify-between space-y-3"
          >
            <h3 className="font-serif text-lg text-stone-800">{tier.name}</h3>
            <p className="text-sm leading-relaxed text-stone-500">
              {tier.description}
            </p>
            <p className="text-xl font-semibold text-stone-800">
              from {tier.price}
            </p>
          </Card>
        ))}
      </div>

      {/* Paper selector */}
      <PaperSelector value={paperStock} onChange={setPaperStock} />

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Order button */}
      <Button
        size="lg"
        onClick={handleOrder}
        loading={isOrdering}
        disabled={!designId}
        className="mx-auto"
      >
        Order Prints
      </Button>
    </section>
  );
}
