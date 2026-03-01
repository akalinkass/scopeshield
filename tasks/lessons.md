# Lessons Learned — ScopeShield

## Architecture lessons

### User.id = Clerk userId (not a separate clerkId)
**Pattern**: `User.id` is the Clerk user ID directly (String @id, no @default(cuid())).
**Why**: Eliminates a mapping join on every auth check. `userId` from `auth()` === `User.id` in DB.
**Mistake to avoid**: Never add a separate `clerkId String @unique` field with an internal `id @default(cuid())`. It creates join complexity and "user not found" bugs.

### Subscription status source of truth
**Pattern**: `customer.subscription.created/updated` events update `Subscription.status`.
**Why**: Subscription events carry full state. `invoice.payment_failed` can arrive out of order.
**Mistake to avoid**: Don't rely on `invoice.payment_failed` to set `status = 'past_due'`. Use it for logging only. Subscription.updated will fire with `status: 'past_due'` when payment fails.

### Webhook handler separation
**Pattern**: `handleStripeEvent()` in `src/lib/stripeWebhook.ts`, route handler is thin.
**Why**: Next.js route handlers are hard to unit test. Pure function with mocked Prisma is trivial.
**Mistake to avoid**: Don't put business logic directly in the route handler.

### Idempotency check MUST be first
**Pattern**: Check `WebhookEvent.findUnique({ where: { stripeId: event.id } })` before ANY processing.
**Why**: Stripe retries webhooks. Without this, you get duplicate DB writes.
**Mistake to avoid**: Don't record the WebhookEvent BEFORE processing — if processing throws, the event is "consumed" but not actually processed.

## Build process lessons

### Node.js PATH issue on Windows
If `npx` is not found in the bash shell, Node.js may be installed but not in the MINGW/bash PATH.
**Fix**: Either add Node to the bash profile, or write all files directly with the Write tool and let the user run npm commands.

### Prisma Json fields vs String @db.Text
For arrays of strings (deliverables, exclusions, etc.), `Json` fields are better than `String @db.Text`.
- `Json` fields are type-safe in Prisma queries
- No manual `JSON.parse/stringify`
- Validates as valid JSON on write
**Mistake to avoid**: `String @db.Text` with a comment `// JSON: string[]` is fragile and error-prone.

## Product lessons

### "Not legal advice" disclaimer is non-negotiable
Must appear in: DOCX footer, site footer, /terms, /privacy.
**Mistake to avoid**: Don't use "legally-worded" language anywhere. Use "best-practice scope protection language."

### DOCX watermark reality check
Single-section footer watermark is sufficient for MVP. "Guaranteed on every page" is not achievable without complex multi-section DOCX logic.
Don't over-promise watermark behavior in the UI copy.
