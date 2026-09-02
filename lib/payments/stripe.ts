import "server-only";

import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Stripe is not configured. Add STRIPE_SECRET_KEY to the server environment.");
  }

  stripeClient ??= new Stripe(secretKey);
  return stripeClient;
}

export async function assertStripeCanAcceptCardPayments() {
  const account = await getStripe().accounts.retrieveCurrent();
  if (!account.charges_enabled || account.capabilities?.card_payments !== "active") {
    throw new Error("STRIPE_ACCOUNT_NOT_READY");
  }
}
