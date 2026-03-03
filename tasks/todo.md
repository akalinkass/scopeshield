# ScopeShield — Live Progress Tracker

## Foundation
- [x] package.json, tsconfig.json, next.config.ts, tailwind.config.ts, postcss.config.mjs
- [x] .env.example
- [x] prisma/schema.prisma (enums, Json fields, User.id = Clerk userId)
- [x] src/middleware.ts (Clerk)
- [x] src/app/layout.tsx (ClerkProvider)
- [x] src/app/globals.css
- [x] src/lib/env.ts (zod startup validation)
- [x] src/lib/db.ts (Prisma singleton)
- [x] CLAUDE.md
- [x] docs/decisions.md
- [x] Deploy skeleton to Vercel

## Scope Builder
- [x] src/lib/presets.ts
- [x] src/components/scope-builder.tsx
- [x] src/app/(app)/new/page.tsx

## AI Generation
- [x] src/lib/claude.ts
- [x] src/lib/entitlements.ts
- [x] src/app/api/generate/route.ts
- [x] src/app/(app)/proposals/[id]/page.tsx
- [x] src/components/proposal-preview.tsx

## DOCX Export
- [x] src/lib/docx.ts
- [x] src/app/api/download/[id]/route.ts

## Stripe Billing
- [ ] Create Stripe products + prices in dashboard (manual step)
- [x] src/lib/stripe.ts
- [x] src/app/api/billing/checkout/route.ts
- [x] src/app/api/billing/portal/route.ts
- [x] src/lib/stripeWebhook.ts (handleStripeEvent)
- [x] src/app/api/webhooks/stripe/route.ts
- [x] src/app/(app)/dashboard/billing-buttons.tsx

## Auth pages
- [x] src/app/api/clerk/route.ts (user sync)
- [x] src/app/sign-in/[[...sign-in]]/page.tsx
- [x] src/app/sign-up/[[...sign-up]]/page.tsx

## App pages
- [x] src/app/(app)/layout.tsx
- [x] src/app/(app)/dashboard/page.tsx

## Marketing pages
- [x] src/app/(marketing)/layout.tsx
- [x] src/app/(marketing)/page.tsx (landing)
- [x] src/app/(marketing)/pricing/page.tsx
- [x] src/app/(marketing)/faq/page.tsx
- [x] src/app/(marketing)/privacy/page.tsx
- [x] src/app/(marketing)/terms/page.tsx

## Tests
- [x] jest.config.ts
- [x] __tests__/stripeWebhook.test.ts

## Docs
- [x] docs/prd.md
- [x] docs/decisions.md
- [x] docs/tasks.md
- [x] docs/runbook.md
- [x] tasks/lessons.md
- [x] README.md

## Phase 3 — Selling Assets
- [x] docs/phase3-selling-assets.md — pricing rationale, copy audit, outreach, email sequences, KPIs

## Quality gates (manual)
- [x] npm install
- [ ] npm run dev
- [x] npm run typecheck
- [x] npm test
- [ ] Sign up → User in DB
- [ ] Generate proposal → DB row created
- [ ] DOCX download works (watermarked)
- [ ] Stripe checkout completes → Subscription in DB
- [ ] Webhook replay idempotency (CLI)
- [ ] Unauthenticated → 401
