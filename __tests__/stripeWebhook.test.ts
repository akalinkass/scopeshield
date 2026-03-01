/**
 * Unit tests for handleStripeEvent — verifies idempotency and event handling.
 * Uses jest-mock-extended to mock Prisma client.
 */

import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

// ── Mock db before importing handler ─────────────────────────────────────────
const mockDb = mockDeep<PrismaClient>();

jest.mock("@/lib/db", () => ({
  db: mockDb,
}));

// Mock env validation so it doesn't throw during test
jest.mock("@/lib/env", () => ({
  env: {
    ANTHROPIC_API_KEY: "sk-ant-test",
    STRIPE_SECRET_KEY: "sk_test_123",
    STRIPE_WEBHOOK_SECRET: "whsec_test",
    STRIPE_PRICE_PRO_MONTHLY: "price_monthly",
    STRIPE_PRICE_PRO_ANNUAL: "price_annual",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_123",
    CLERK_SECRET_KEY: "sk_test_clerk",
    CLERK_WEBHOOK_SECRET: "whsec_clerk",
    DATABASE_URL: "postgresql://test",
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  },
}));

import { handleStripeEvent } from "@/lib/stripeWebhook";
import type Stripe from "stripe";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeSubCreatedEvent(overrides?: Partial<Stripe.Event>): Stripe.Event {
  return {
    id: "evt_test_sub_created_001",
    type: "customer.subscription.created",
    data: {
      object: {
        id: "sub_test_001",
        object: "subscription",
        customer: "cus_test_001",
        status: "active",
        items: {
          data: [{ price: { id: "price_monthly" } }],
        },
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
        cancel_at_period_end: false,
      } as unknown as Stripe.Subscription,
    },
    ...overrides,
  } as Stripe.Event;
}

function makeCheckoutCompletedEvent(): Stripe.Event {
  return {
    id: "evt_test_checkout_001",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_001",
        object: "checkout.session",
        customer: "cus_test_001",
        metadata: { userId: "user_clerk_001" },
      } as unknown as Stripe.Checkout.Session,
    },
  } as Stripe.Event;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("handleStripeEvent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: event not yet processed
    mockDb.webhookEvent.findUnique.mockResolvedValue(null);
    mockDb.webhookEvent.create.mockResolvedValue({
      id: "wh_1",
      stripeId: "evt_test_001",
      type: "test",
      processedAt: new Date(),
    });
  });

  // ── Idempotency ────────────────────────────────────────────────────────────

  it("skips processing if event already exists in WebhookEvent table", async () => {
    const event = makeSubCreatedEvent();

    // Simulate: event was already processed
    mockDb.webhookEvent.findUnique.mockResolvedValue({
      id: "wh_existing",
      stripeId: event.id,
      type: event.type,
      processedAt: new Date(),
    });

    await handleStripeEvent(event);

    // Should NOT call any write operations after finding duplicate
    expect(mockDb.subscription.upsert).not.toHaveBeenCalled();
    expect(mockDb.webhookEvent.create).not.toHaveBeenCalled();
  });

  it("processes the same event id twice safely — second call is a no-op", async () => {
    const event = makeSubCreatedEvent();

    // First call: event doesn't exist
    mockDb.webhookEvent.findUnique.mockResolvedValueOnce(null);
    mockDb.user.findUnique.mockResolvedValueOnce({ id: "user_clerk_001" } as any);
    mockDb.subscription.upsert.mockResolvedValueOnce({} as any);

    await handleStripeEvent(event);
    expect(mockDb.subscription.upsert).toHaveBeenCalledTimes(1);

    // Second call: event now exists (idempotency)
    mockDb.webhookEvent.findUnique.mockResolvedValueOnce({
      id: "wh_1",
      stripeId: event.id,
      type: event.type,
      processedAt: new Date(),
    });

    await handleStripeEvent(event);

    // upsert should NOT have been called again
    expect(mockDb.subscription.upsert).toHaveBeenCalledTimes(1);
  });

  // ── Subscription created ────────────────────────────────────────────────────

  it("upserts Subscription row on customer.subscription.created", async () => {
    const event = makeSubCreatedEvent();

    mockDb.user.findUnique.mockResolvedValue({ id: "user_clerk_001" } as any);
    mockDb.subscription.upsert.mockResolvedValue({} as any);

    await handleStripeEvent(event);

    expect(mockDb.user.findUnique).toHaveBeenCalledWith({
      where: { stripeCustomerId: "cus_test_001" },
      select: { id: true },
    });

    expect(mockDb.subscription.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user_clerk_001" },
        create: expect.objectContaining({
          userId: "user_clerk_001",
          stripeSubId: "sub_test_001",
          status: "active",
        }),
        update: expect.objectContaining({
          status: "active",
        }),
      })
    );

    expect(mockDb.webhookEvent.create).toHaveBeenCalledWith({
      data: { stripeId: event.id, type: event.type },
    });
  });

  it("logs error and skips upsert if user not found for subscription event", async () => {
    const event = makeSubCreatedEvent();
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockDb.user.findUnique.mockResolvedValue(null);

    await handleStripeEvent(event);

    expect(mockDb.subscription.upsert).not.toHaveBeenCalled();
    // Still records the event so it's not retried
    expect(mockDb.webhookEvent.create).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  // ── Checkout session completed ─────────────────────────────────────────────

  it("updates User.stripeCustomerId on checkout.session.completed", async () => {
    const event = makeCheckoutCompletedEvent();
    mockDb.user.update.mockResolvedValue({} as any);

    await handleStripeEvent(event);

    expect(mockDb.user.update).toHaveBeenCalledWith({
      where: { id: "user_clerk_001" },
      data: { stripeCustomerId: "cus_test_001" },
    });

    expect(mockDb.webhookEvent.create).toHaveBeenCalled();
  });

  // ── Subscription deleted ────────────────────────────────────────────────────

  it("sets status to canceled on customer.subscription.deleted", async () => {
    const event: Stripe.Event = {
      id: "evt_test_sub_del_001",
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_test_001",
          object: "subscription",
          customer: "cus_test_001",
          status: "canceled",
        } as unknown as Stripe.Subscription,
      },
    } as Stripe.Event;

    mockDb.subscription.updateMany.mockResolvedValue({ count: 1 } as any);

    await handleStripeEvent(event);

    expect(mockDb.subscription.updateMany).toHaveBeenCalledWith({
      where: { stripeSubId: "sub_test_001" },
      data: { status: "canceled" },
    });
  });
});
