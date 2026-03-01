/**
 * Stripe webhook endpoint.
 * Only responsibility: raw body read + signature verification + dispatch to handleStripeEvent.
 * All business logic lives in src/lib/stripeWebhook.ts (testable unit).
 */
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { handleStripeEvent } from "@/lib/stripeWebhook";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(JSON.stringify({ event: "webhook_sig_error", error: String(err) }));
    return new NextResponse(`Webhook signature verification failed`, { status: 400 });
  }

  try {
    await handleStripeEvent(event);
  } catch (err) {
    console.error(JSON.stringify({ event: "webhook_handler_error", type: event.type, error: String(err) }));
    // Return 500 so Stripe retries
    return new NextResponse("Webhook handler error", { status: 500 });
  }

  return NextResponse.json({ received: true });
}
