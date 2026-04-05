import Stripe from "stripe"

let _stripe: Stripe | null = null

export function getStripeServer(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
      apiVersion: "2026-03-25.dahlia",
    })
  }
  return _stripe
}

// Backward compat — lazy getter
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripeServer() as unknown as Record<string, unknown>)[prop as string]
  },
})
