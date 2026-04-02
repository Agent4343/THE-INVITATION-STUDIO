import Stripe from "stripe";
import { loadStripe, type Stripe as StripeClient } from "@stripe/stripe-js";

// Server-side Stripe instance – lazy-initialized to avoid build-time errors
let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });
  }
  return _stripe;
}

// Backward-compatible named export — callers use `stripe.xxx()`
// This is a getter-backed object so Stripe is only instantiated on first use.
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    return Reflect.get(getStripe(), prop, receiver);
  },
});

// Client-side Stripe.js promise (singleton)
let stripePromise: Promise<StripeClient | null> | null = null;

export function getStripePromise() {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    );
  }
  return stripePromise;
}
