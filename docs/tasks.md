# ScopeShield — 14-Day MVP Build Plan

## Day 1–2: Foundation
- [x] Next.js 14 + TypeScript + Tailwind app initialized
- [x] Clerk auth configured (middleware, sign-in/sign-up pages, user sync webhook)
- [x] Neon Postgres + Prisma schema (enums, Json fields, correct User.id = Clerk userId)
- [x] `src/lib/env.ts` — zod validation (throws on startup for missing vars)
- [x] `.env.example` created
- [x] `CLAUDE.md` created
- [x] `docs/decisions.md` created
- [ ] Deploy skeleton to Vercel (confirm CI passes)

## Day 3–4: Scope Builder
- [x] `src/lib/presets.ts` — presets for all ProjectTypes
- [x] `src/components/scope-builder.tsx` — checkbox list UI with add/remove
- [x] `src/app/(app)/new/page.tsx` — full Scope Builder form

## Day 5–6: AI Generation + DB Save
- [x] `src/lib/claude.ts` — prompt templates, `generateDocuments()`
- [x] `src/lib/entitlements.ts` — `canGenerate()`, `canDownloadClean()`, `getUsage()`
- [x] `src/app/api/generate/route.ts` — auth + entitlement + AI + DB save
- [x] `src/app/(app)/proposals/[id]/page.tsx` — tabbed preview
- [x] `src/components/proposal-preview.tsx` — Proposal / SOW / Change Request tabs

## Day 7–8: DOCX Export
- [x] `src/lib/docx.ts` — `generateDocx()` with watermark/clean variants
- [x] `src/app/api/download/[id]/route.ts` — auth + ownership + entitlement + DOCX

## Day 9–10: Stripe Billing
- [ ] Create Stripe products + prices in dashboard
- [x] `src/lib/stripe.ts` — Stripe client
- [x] `src/app/api/billing/checkout/route.ts`
- [x] `src/app/api/billing/portal/route.ts`
- [x] `src/lib/stripeWebhook.ts` — `handleStripeEvent()` (testable unit)
- [x] `src/app/api/webhooks/stripe/route.ts` — sig verify + dispatch
- [x] Dashboard: billing buttons component

## Day 11: Tests + Marketing
- [x] `__tests__/stripeWebhook.test.ts` — idempotency + event handling tests
- [x] `/` — landing page
- [x] `/pricing` — Free vs Pro table + upgrade flow
- [x] `/faq` — 7 questions
- [x] `/privacy` — privacy policy
- [x] `/terms` — terms of service (with prominent "Not legal advice." banner)

## Day 12–13: Polish + Ops
- [x] Rate limiting on `/api/generate` (1 req/10s per user)
- [x] Structured JSON logging in all API routes
- [x] Dashboard usage counter + progress bar
- [ ] Full happy path E2E test (manual)
- [ ] Stripe CLI webhook test (manual — see runbook.md)
- [x] Error pages (not-found.tsx)

## Day 14: Documentation + Quality Gates
- [x] `README.md`
- [x] `docs/runbook.md`
- [x] `tasks/lessons.md`
- [ ] Run all 10 quality gates (see runbook.md)
- [ ] Confirm DOCX opens in Word/Google Docs
- [ ] Confirm Stripe test checkout works end-to-end
