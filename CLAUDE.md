# ScopeShield — Project Rules

## How to run locally

```bash
# 1. Install dependencies
npm install

# 2. Copy env vars
cp .env.example .env.local
# Fill in all values (see docs/runbook.md for instructions)

# 3. Run database migration
npx prisma migrate dev --name init
npx prisma generate

# 4. Start dev server
npm run dev
# → http://localhost:3000

# 5. Run tests
npm test

# 6. Type check
npm run typecheck
```

## Key architectural decisions

| Decision | Choice | Why |
|---|---|---|
| Auth | Clerk v5 | `User.id = Clerk userId` — no mapping layer |
| DB | Neon Postgres + Prisma | Json fields for scope arrays; enum types for safety |
| AI | Anthropic Haiku | Polishes structured scope only (does not invent) |
| Webhook logic | `src/lib/stripeWebhook.ts` | Separate from route handler for testability |
| Entitlements | Two gating points | `/api/generate` + `/api/download/[id]` both gated |
| DOCX | `docx` npm package | Pure JS, no system deps |

## Critical patterns

### User identity
```ts
// User.id === Clerk userId — NEVER create a separate clerkId field
const { userId } = await auth();
// userId is directly the DB primary key
const user = await db.user.findUnique({ where: { id: userId } });
```

### Server-side entitlement gating (MUST be in both routes)
```ts
// In /api/generate:
const entitlement = await canGenerate(userId);
if (!entitlement.allowed) return 402;

// In /api/download/[id]:
const clean = await canDownloadClean(userId);
// Pass clean flag to generateDocx()
```

### Webhook idempotency (ALWAYS first step in handleStripeEvent)
```ts
const existing = await db.webhookEvent.findUnique({ where: { stripeId: event.id } });
if (existing) return; // skip duplicate
```

### Subscription status source of truth
`customer.subscription.created/updated` = source of truth for `Subscription.status`.
`invoice.payment_failed` = supplemental logging only.

## Disclaimer requirement
"Not legal advice." must appear in:
- DOCX footer (every generated document)
- Site footer (all pages)
- /terms page (prominently)
- /privacy page

## Environment variables
See `.env.example` for all required variables. The app throws at startup (via `src/lib/env.ts`) if any are missing or malformed.

## Testing
Run `npm test` to execute webhook idempotency tests. New tests go in `__tests__/`.

## File structure overview
```
src/
  app/
    (marketing)/     ← public pages (/, /pricing, /faq, /privacy, /terms)
    (app)/           ← authenticated pages (dashboard, new, proposals/[id])
    api/
      generate/      ← POST: AI generation + entitlement check
      download/[id]/ ← GET: DOCX (watermarked or clean)
      billing/       ← checkout + portal
      webhooks/stripe/ ← Stripe webhook (sig verify + dispatch)
      clerk/         ← Clerk user.created webhook
  lib/
    env.ts           ← zod validation (throws at startup)
    db.ts            ← Prisma singleton
    stripe.ts        ← Stripe client
    claude.ts        ← Anthropic client + prompt templates
    docx.ts          ← DOCX generation
    entitlements.ts  ← server-side gating (used in 2 routes)
    presets.ts       ← Scope Builder presets by project type
    stripeWebhook.ts ← handleStripeEvent (testable unit)
  components/
    scope-builder.tsx
    proposal-preview.tsx
```
