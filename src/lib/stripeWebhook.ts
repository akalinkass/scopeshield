/**
 * handleStripeEvent — testable unit for Stripe webhook processing.
 * The route handler at /api/webhooks/stripe only does:
 *   1. Read raw body
 *   2. Verify signature
 *   3. Call handleStripeEvent(event)
 */

import Stripe from "stripe";
import { db } from "@/lib/db";
import { SubscriptionStatus } from "@prisma/client";

function stripeStatusToEnum(status: string): SubscriptionStatus {
  const map: Record<string, SubscriptionStatus> = {
    active: "active",
    past_due: "past_due",
    canceled: "canceled",
    trialing: "trialing",
    incomplete: "incomplete",
    unpaid: "unpaid",
  };
  return map[status] ?? "incomplete";
}

export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  // ── Idempotency: skip already-processed events ────────────────────────────
  const existing = await db.webhookEvent.findUnique({
    where: { stripeId: event.id },
  });
  if (existing) {
    console.log(
      JSON.stringify({ event: "webhook_skip_duplicate", stripeId: event.id, type: event.type })
    );
    return;
  }

  // ── Process event ─────────────────────────────────────────────────────────
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const customerId =
        typeof session.customer === "string" ? session.customer : null;

      if (userId && customerId) {
        await db.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId },
        });
        console.log(JSON.stringify({ event: "stripe_customer_linked", userId, customerId }));
      }
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId =
        typeof sub.customer === "string" ? sub.customer : sub.customer.id;

      const user = await db.user.findUnique({
        where: { stripeCustomerId: customerId },
        select: { id: true },
      });
      if (!user) {
        console.error(JSON.stringify({ event: "webhook_user_not_found", customerId }));
        break;
      }

      await db.subscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          stripeSubId: sub.id,
          stripePriceId: sub.items.data[0]?.price.id ?? "",
          status: stripeStatusToEnum(sub.status),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
        update: {
          stripeSubId: sub.id,
          stripePriceId: sub.items.data[0]?.price.id ?? "",
          status: stripeStatusToEnum(sub.status),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
      });
      console.log(JSON.stringify({ event: "subscription_upserted", userId: user.id, status: sub.status }));
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId =
        typeof sub.customer === "string" ? sub.customer : sub.customer.id;

      await db.subscription.updateMany({
        where: { stripeSubId: sub.id },
        data: { status: "canceled" },
      });
      console.log(JSON.stringify({ event: "subscription_canceled", stripeSubId: sub.id, customerId }));
      break;
    }

    case "invoice.payment_failed": {
      // Supplemental only — subscription status is source of truth via subscription.updated
      const invoice = event.data.object as Stripe.Invoice;
      console.log(JSON.stringify({ event: "invoice_payment_failed", invoiceId: invoice.id }));
      break;
    }

    default:
      // Unhandled event types are safe to ignore
      console.log(JSON.stringify({ event: "webhook_unhandled", type: event.type }));
  }

  // ── Record processed event (idempotency) ──────────────────────────────────
  await db.webhookEvent.create({
    data: { stripeId: event.id, type: event.type },
  });
}
