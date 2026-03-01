# ScopeShield Runbook

## Local development setup

### Prerequisites
- Node.js 18+
- npm 9+
- Stripe CLI (for webhook testing)
- Git

### 1. Clone and install
```bash
git clone <repo-url> scopeshield
cd scopeshield
npm install
cp .env.example .env.local
```

### 2. Set up services (get API keys)

**Clerk** (auth)
1. Go to https://clerk.com → create a new application
2. Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
3. In Clerk dashboard → Webhooks → Add endpoint:
   - URL: `https://your-domain.com/api/clerk` (or use ngrok for local)
   - Events: `user.created`
   - Copy the signing secret → `CLERK_WEBHOOK_SECRET`

**Neon** (database)
1. Go to https://neon.tech → create a new project
2. Copy the connection string → `DATABASE_URL`

**Anthropic** (AI)
1. Go to https://console.anthropic.com → API Keys
2. Create a key → `ANTHROPIC_API_KEY`

**Stripe** (billing)
1. Go to https://stripe.com → Dashboard
2. Copy test secret key → `STRIPE_SECRET_KEY`
3. Copy publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Create two products:
   - "ScopeShield Pro Monthly" → $14/month recurring → copy price ID → `STRIPE_PRICE_PRO_MONTHLY`
   - "ScopeShield Pro Annual" → $119/year recurring → copy price ID → `STRIPE_PRICE_PRO_ANNUAL`
5. Webhooks → skip for now (handled via Stripe CLI in local dev)

### 3. Run database migration
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Start dev server
```bash
npm run dev
# → http://localhost:3000
```

### 5. Test webhook locally (Stripe CLI)
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# In another terminal — trigger test events:
stripe trigger customer.subscription.created
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_failed

# Watch the DB for changes:
npx prisma studio
```

### 6. Run tests
```bash
npm test
```

### 7. Type check
```bash
npm run typecheck
```

---

## Stripe test cards
| Scenario | Card number |
|---|---|
| Success | 4242 4242 4242 4242 |
| Decline | 4000 0000 0000 0002 |
| 3D Secure | 4000 0025 0000 3155 |

Use any future expiry date, any CVC, any ZIP.

---

## Vercel deployment

### First deploy
1. Push to GitHub
2. Import repo in Vercel: https://vercel.com/new
3. Add all environment variables from `.env.local`
4. Set `NEXT_PUBLIC_APP_URL` = your Vercel domain (e.g. `https://scopeshield.vercel.app`)
5. Deploy

### After deploy — configure Stripe webhooks for production
1. Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
4. Copy the signing secret → update `STRIPE_WEBHOOK_SECRET` in Vercel env vars
5. Redeploy

### After deploy — configure Clerk webhook for production
1. Clerk Dashboard → Webhooks → Add endpoint
2. URL: `https://your-domain.vercel.app/api/clerk`
3. Events: `user.created`
4. Copy signing secret → update `CLERK_WEBHOOK_SECRET` in Vercel env vars

---

## Quality gates checklist
Run these before marking the MVP complete:

- [ ] `npm install` — exits cleanly
- [ ] `npm run dev` — loads at localhost:3000
- [ ] `npm run typecheck` — zero TypeScript errors
- [ ] `npm test` — all tests pass
- [ ] Sign up via Clerk → User row appears in DB (`npx prisma studio`)
- [ ] Fill Scope Builder + generate → proposal created in DB
- [ ] DOCX download (free) — opens in Word/Docs with watermark footer visible
- [ ] Stripe Checkout (test card 4242...) completes → Subscription row in DB
- [ ] Stripe CLI replay of same event ID → DB unchanged (idempotency)
- [ ] Unauthenticated POST to `/api/generate` → 401 response
- [ ] Free user download → watermarked; manipulate URL as Pro user → still correct

---

## Common issues

**"Invalid environment variables" on startup**
→ Check `.env.local` — all vars in `.env.example` must be set.

**Clerk webhook 400 errors**
→ Verify `CLERK_WEBHOOK_SECRET` matches the Clerk dashboard webhook signing secret.
→ Make sure you're forwarding to `/api/clerk` not `/api/webhooks/clerk`.

**Prisma "Table not found" errors**
→ Run `npx prisma migrate dev` again. Check `DATABASE_URL` is correct.

**Stripe webhook signature failure**
→ Local: use `stripe listen` CLI, not a hardcoded secret.
→ Production: confirm the signing secret in Vercel matches the Stripe webhook endpoint secret.
