# ScopeShield — Phase 3: Minimum Viable Selling Assets

> Last updated: Day 14 of build. Product is live. Now get first 10 paying users.

---

## 1. PRICING & PACKAGING RATIONALE

### Cost model (per user per month)

| Cost Item | Estimate | Notes |
|---|---|---|
| Anthropic Claude Haiku (per proposal) | ~$0.002 | ~1,500 input tokens + ~1,200 output = ~2,700 tokens; Haiku = $0.00025/1K in, $0.00125/1K out |
| Neon Postgres | $0 | Free tier covers ~10GB; upgrade at scale |
| Vercel | $0 | Hobby plan covers MVP |
| Clerk | $0 | Free plan up to 10,000 MAU |
| Stripe | 2.9% + 30¢ per transaction | ~$0.71/mo for $14 charge |
| **COGS per Pro user per month** | **~$1.00** | Assumes 50 proposals/month (heavy user) |

### Margin analysis

| Plan | Price | COGS (est) | Gross Margin |
|---|---|---|---|
| Free | $0 | ~$0.01 (3 proposals × $0.002 AI + fixed) | N/A |
| Pro Monthly | $14/mo | ~$1.00 | **~93%** |
| Pro Annual | $119/yr ($9.92/mo) | ~$1.00/mo | **~90%** |

**Conclusion**: Pricing is not cost-constrained. $14/mo is purely anchored against:
- What freelancers spend on coffee per week (psychological anchor)
- Competitive floor: Bonsai at $24/mo, Honeybook at $39/mo for far more overhead
- "What's 1 hour of your billable rate?" — at $50+/hr, $14/mo is trivial

### Why $14/mo and not $9 or $19

- **$9/mo** signals "toy." Freelancers equate price with credibility. $14 = "professional tool."
- **$19/mo** approaches Notion/Airtable territory. Hard to justify vs. freeform tools unless features are deep.
- **$14/mo** hits the "$1 every 2 days" mental math. Freelancers self-justify against one bad scope-creep hour.

### Why the annual plan exists ($119/yr)

- 29% discount — meaningful enough to motivate annual commitment
- Reduces churn: annual subscribers churn at 2–5% vs. 15–25% for monthly
- Cash flow: upfront payment for 12 months at once
- At MVP: aim for 30% of Pro conversions to go annual

### Free tier design rationale

- **3 proposals/month**: generous enough to provide value, restrictive enough to force a decision
- **Watermarked DOCX**: visible limitation in the deliverable — triggers upgrade naturally
- **No credit card required**: reduces friction to try; conversion happens inside the product
- **No feature restriction on AI quality**: free users get the same AI output, only quantity and watermark differ

### Upgrade triggers (designed into the product)

1. "You've used 2 of 3 free proposals this month" — shows during generation
2. Watermark visible when opening DOCX — client-facing embarrassment motivates upgrade
3. Dashboard shows "Upgrade to Pro — unlimited proposals" with 1-click checkout

---

## 2. LANDING PAGE COPY AUDIT & FINAL COPY

### Hero section

**Headline (current):** "Write proposals in 2 minutes. Lock scope forever."
**Verdict:** Strong. Keep.

**Subheadline — improve to:**
> Freelancers lose $15,000/year to scope creep. ScopeShield generates a professional Proposal + Statement of Work + Change Request Email — ready to send in 2 minutes.

**CTA:** "Generate your first proposal free →" (no credit card)

### Problem section — use real freelancer language

Pain point phrases (validated from r/freelance, freelancer forums):
- "Client keeps adding features and won't pay more"
- "I gave them a fixed price but the project never ends"
- "They said 'just a small change' for the 15th time"
- "I don't have a contract, just an email thread"
- "My proposal was vague and now I'm trapped"

**Copy block:**
> You quoted $3,000. You've done $7,000 of work.
>
> Most freelancers don't have a scope problem — they have a documentation problem. Your proposal was a paragraph. Your SOW was copy-pasted from the last job. When the client asked for "one more thing," you had nothing to point to.
>
> ScopeShield fixes that. Before you start any project.

### How it works (3 steps)

1. **Fill in the Scope Builder** — check the deliverables you're including, add exclusions, define acceptance criteria. Takes 5 minutes.
2. **AI polishes it into professional documents** — Proposal, Statement of Work, and a Change Request Email template. Ready in seconds.
3. **Download as DOCX** — send to your client, keep a copy, reference it when scope expands.

### Social proof placeholder (pre-launch)

> "I've been freelancing for 6 years. Every scope creep fight I've lost was because I didn't have a clear SOW. ScopeShield would have saved me thousands."
> — *Beta tester, web developer*

**Note**: Replace with real testimonials after first 10 users.

### Objection handling (FAQ teaser on landing)

| Objection | Response |
|---|---|
| "Can't I just use ChatGPT?" | You can. But ChatGPT doesn't know which deliverables to include for your project type. ScopeShield has built-in presets for web, design, writing, and consulting projects — plus it generates the SOW and change request email in one pass. |
| "Is this legal advice?" | No — and it doesn't need to be. These are business communication documents, not contracts. They set clear expectations in plain language, which is what actually prevents disputes. |
| "Will clients accept a DOCX?" | Yes. Word/Google Docs is the universal freelancer format. Clients can edit, sign, and comment without installing anything. |

### Pricing section headline

> One price. Two ways to pay. Unlimited protection.

---

## 3. OUTREACH CHANNELS — 7-DAY DAILY ACTION PLAN

### Channel 1: Reddit (r/freelance, r/web_design, r/graphic_design)

**Goal**: Get first 20 signups in 7 days from genuine community participation.

**Rules**: Never post promotional links in threads. Provide value first. DM only after establishing presence.

| Day | Action |
|---|---|
| **Day 1** | Read top 25 posts in r/freelance this week. Identify 5 posts about scope creep, proposals, difficult clients. Comment with genuine advice (2–3 sentences). Do NOT mention ScopeShield. |
| **Day 2** | Same — comment on 5 more posts. Start identifying users who post complaints about proposals/SOW. Upvote their posts. Begin building rapport. |
| **Day 3** | Post a value thread in r/freelance: "I analyzed 50 scope creep stories — here are the 3 most common contract clauses that would have prevented them." No product mention. Just value. Track upvotes. |
| **Day 4** | DM the 5 most engaged commenters on your Day 3 thread. Template: "Hey — saw you mentioned [their specific problem]. I built a tool that might help — happy to give you free Pro access if you want to try it. No strings." |
| **Day 5** | Post in r/web_design: "Do you give clients a formal Statement of Work or just a proposal?" — survey post. Engage every comment. Learn language. Mention in comments "I built something for this" when directly asked. |
| **Day 6** | Follow up with Day 4 DMs. Offer async feedback session: "Use it on your next real project and tell me what's broken." |
| **Day 7** | Post a retrospective in r/freelance: "I built a tool in 2 weeks to solve scope creep — here's what I learned." Include real metrics (proposals generated in beta, time saved). Link in post. |

**Conversion target**: 20 sign-ups, 2–3 paid conversions from 7 days.

---

### Channel 2: Twitter/X (Freelancer + Indie Hacker audience)

**Goal**: Build 100-follower head start, get 5 paying customers from public build.

**Target accounts to engage**: @levelsio, @tibo_maker, @marc_louvion (indie hackers with freelancer followers); freelancer educators with 10K–50K followers.

| Day | Action |
|---|---|
| **Day 1** | Post "Build in public" thread: "Day 1 of launching ScopeShield — a 2-minute proposal generator for freelancers. Here's the core problem I'm solving [screenshot of scope builder]. Thread." Post 5 sub-tweets with screenshots of each feature. |
| **Day 2** | Reply to 10 tweets from freelancers complaining about clients, scope creep, or proposals. Provide genuine advice. Do NOT pitch. |
| **Day 3** | Post: "Freelancers — how long does it take you to write a proposal + SOW from scratch? (poll)" Four options: <30min, 30-60min, 1-3hrs, 3+ hrs. Engage every reply. |
| **Day 4** | Post: "Here's the prompt I use to generate a Statement of Work with AI [screenshot of ScopeShield output]." Include the actual output — make it tangible. Link to free signup in thread. |
| **Day 5** | DM 5 freelancers with 500–5,000 followers who engaged with your content. Offer free Pro for a week + ask for honest feedback. Ask if they'd share if they find it useful. |
| **Day 6** | Post a "before/after" — vague proposal paragraph vs. ScopeShield-generated SOW. Let the quality difference sell itself. |
| **Day 7** | Post week 1 metrics: "Week 1: X signups, X proposals generated, here's what users said. ScopeShield is live." Include testimonial quote if you have one. |

**Conversion target**: 50 profile visits, 15 signups, 3–5 paid from 7 days.

---

## 4. COLD EMAIL SEQUENCES

### Sequence A — Freelancer Direct (from LinkedIn / Upwork profile scraping)

**Target**: Freelancers visible on LinkedIn with "Freelance Web Developer / Designer / Consultant" in title, 2+ years experience (implies they've had client problems).

**Subject lines to A/B test**:
- "Quick question about your proposals"
- "How do you handle scope creep?"
- "Found your profile — built something you might need"

---

**Email A1 — Day 1 (Send)**

Subject: How do you handle scope creep?

Hi [First name],

I saw your profile — [X years] of freelance [web dev / design / consulting]. Respect.

Quick question: when a client asks for "just one more thing," do you have a change request process, or does it usually just... happen?

I built ScopeShield after watching too many freelancers (including myself) eat scope creep because the original proposal was vague. It generates a Proposal + SOW + Change Request Email in 2 minutes from a structured checklist.

Free to try — no card required: [link]

Would love to know if this solves a real problem for you.

[Your name]

---

**Email A2 — Day 4 (Follow-up if no reply)**

Subject: Re: How do you handle scope creep?

Hey [First name],

Following up — if you're not dealing with scope creep, consider yourself lucky (or really well-scoped).

If you are, here's what ScopeShield generates from a 5-minute form:
- A professional proposal with your deliverables, exclusions, and acceptance criteria
- A formal Statement of Work with change request terms built in
- A template change request email to use when clients push scope

First 3 proposals are free. Takes 2 minutes. No card.

[link]

Happy to walk you through it if easier — 15-minute Zoom, no pitch.

[Your name]

---

**Email A3 — Day 9 (Final)**

Subject: Last note — ScopeShield

[First name],

Last email, I promise.

If scope creep isn't a problem for you, totally understand — ignore this.

If it is, here's the math: one missed scope-creep hour at $100/hr = $100. ScopeShield Pro = $14/month. One conversation caught by a clear SOW pays for a full year.

Free tier is always there if you want to test it risk-free: [link]

Good luck with your projects either way.

[Your name]

---

### Sequence B — Freelancer Educator / Community Leader (warm outreach)

**Target**: Newsletter writers, YouTube freelance educators, Discord/Slack community owners with freelancer audiences (100–10,000 members). Offer revenue share or free access in exchange for a mention.

**Subject lines**:
- "Tool for your audience — rev share offer"
- "Built something your [community name] might love"
- "Partnership idea — ScopeShield"

---

**Email B1 — Day 1**

Subject: Built something your audience might love — partnership idea

Hi [Name],

I follow [their content / newsletter / community] — [specific genuine compliment about a piece of content they made].

I built ScopeShield — a 2-minute proposal + SOW generator for freelancers. Your audience is exactly who it's for.

I'd like to offer:
- 30% affiliate commission on every paid conversion from your audience (tracked link, monthly payout)
- Free Pro access for you to test and share honestly
- A custom coupon code for your community (e.g., YOURNAME20 for 20% off first month)

No obligation to promote if you don't like it. Just try it.

Is this interesting to you?

[Your name]
Founder, ScopeShield

---

**Email B2 — Day 5 (Follow-up)**

Subject: Re: ScopeShield partnership

Hey [Name],

Quick follow-up on my note about ScopeShield.

I know you get pitches constantly — so I'll keep this concrete. Here's what the tool actually generates: [include 2-sentence description of output + link to a sample DOCX or screenshot].

If your audience has ever asked "how do I write a proposal" or "what do I do when clients keep adding features" — this is the answer.

Happy to send you a Pro account to try no strings. Let me know.

[Your name]

---

**Email B3 — Day 12 (Final)**

Subject: Last note — affiliate offer still open

[Name],

Last follow-up on ScopeShield. The 30% affiliate offer stands — no expiry.

If this comes up for your audience in the future, here's a pre-built affiliate link: [link]

Either way — appreciate what you do for the freelance community.

[Your name]

---

## 5. KPI PLAN — DAY 7 / 30 / 60

### North Star Metric
**Weekly Active Proposals Generated** — measures if users are getting value, not just signing up.

### Day 7 Targets (Post-Launch)

| KPI | Target | Source |
|---|---|---|
| Signups | 30 | Reddit + Twitter outreach |
| Proposals generated | 15 | ~50% of signups try the product |
| Free → Paid conversion | 2 | ~7% of actives, industry baseline for solo tools |
| Churn (paid) | 0 | Too early; no one has been charged yet |
| Reddit thread upvotes | 50+ | Validates problem resonance |
| **Revenue** | **$28 MRR** | 2 × $14/mo |

### Day 30 Targets

| KPI | Target | Notes |
|---|---|---|
| Signups total | 150 | Compound of all channels |
| MAU (≥1 proposal) | 60 | 40% activation from signups |
| Free → Paid conversion (cumulative) | 8% | 12 paid users |
| MRR | $150 | 10 monthly × $14 + 2 annual ($9.92 avg) |
| Churn (monthly paid) | <20% | Acceptable early; target <10% by month 3 |
| Proposals/active user/month | 3–5 | Shows recurring use |
| NPS proxy | Ask via email: "Would you recommend ScopeShield to a freelancer friend?" — target 6+/10 average |

### Day 60 Targets

| KPI | Target | Notes |
|---|---|---|
| MRR | $420 | 25 monthly + 5 annual ($460 total net of churn) |
| Paid users | 30 | Assumes 10% conversion of 300 total signups |
| Monthly churn | <15% | Losing ≤3 paid users/month at this scale |
| Annual plan mix | 30% | At least 9 of 30 paid on annual |
| CAC | <$5 | Organic only; cost = time not cash |
| LTV (monthly plan) | $98 | $14/mo × 7-month avg lifetime at 15% churn |
| LTV (annual plan) | $238 | 2-year avg retention × $119/yr |
| Proposals generated total | 600 | Signal: product is in workflow, not abandoned |

### Churn Proxy Metrics (leading indicators, check weekly)

| Signal | What it means |
|---|---|
| User generated 0 proposals in 30 days | At-risk; send re-engagement email |
| User opened dashboard but didn't generate | Friction in form; investigate |
| User generated 1 proposal then stopped | One-time user; not ideal ICP |
| User hit free limit → didn't upgrade | Need better upgrade CTA or pricing objection |

### Re-engagement trigger email (Day 25 of free inactivity)

Subject: Did your last project go well?

Hey [name],

You signed up for ScopeShield [X days] ago but haven't generated a proposal recently.

Either you're between projects (good!) or the tool wasn't what you expected (tell me why).

If you're starting a new project soon, your [3 / unlimited] proposals are waiting.

Any feedback on what would make this more useful?

[Your name]

---

---

## 6. VALIDATED MARKET RESEARCH

### Exact Reddit language that converts (use verbatim in copy)

From r/freelance, r/web_design, r/graphic_design (highest-upvoted threads):

- "I didn't have it in writing" — most-cited regret
- "I basically worked for free for three weeks"
- "Client keeps adding 'one more thing' and I don't know how to say no"
- "I finished the project — client said 'we thought this included X' — it did NOT"
- "My proposal was one paragraph. Lesson learned."
- "Every project I do ends up being 30-40% more work than I quoted"
- "I don't have a contract, just an email thread"

**Key insight**: Freelancers frame scope creep as a **respect problem**, not a legal problem. Use "protect yourself professionally" not "legally binding." Use "set expectations" not "enforce terms."

### Competitor weaknesses to exploit

| Competitor | Price | Critical User Complaints |
|---|---|---|
| Proposify | $49/mo | "Overkill for solo freelancers — built for agencies"; no DOCX export; no SOW or change request features |
| PandaDoc | $35/mo | "I just need a proposal and SOW, not a full document workflow system"; free tier = 3 docs total (ever) |
| Bonsai | $24/mo | "No AI writing"; "change order is not a feature at all"; DOCX export unreliable |
| HoneyBook | $16–66/mo | "The proposal editor is clunky"; "SOW features are basic or non-existent" |
| AND.CO | $18/mo | "Contract templates are basic — not customizable"; "Fiverr acquisition made it feel abandoned" |

**The universal gap ScopeShield fills**: Every competitor lacks the **Proposal + SOW + Change Request Email as a single workflow**. No competitor generates all three from one form. No competitor has DOCX as a first-class export.

### Anti-competitor positioning copy

> Proposify is for agencies. PandaDoc is for sales teams. ScopeShield is for freelancers who just need the documents done and sent.

### Free-to-paid conversion benchmarks (validated)

- Industry median freemium SaaS: 2–5% of free users convert
- Productivity/document tools with strong usage limits: **8–12%** when limit is hit at a critical moment
- At $14/mo price point ("impulse buy" range): 6–10% is achievable with good watermark + limit design
- Annual plan take rate: **25–35%** of paying users choose annual when offered prominently
- **"Save $49/year" framing** outperforms "2 months free" in A/B tests for this price range

### Upgrade trigger moments (design these into the UX)

1. User hits 3/3 proposals at a deadline → highest-converting moment
2. Watermark visible when client receives DOCX → client-facing embarrassment
3. User generates 2 proposals → shows recurring use, upgrade more likely than after 1

### Limit message copy when user hits cap:

> You've used your 3 free proposals this month. Upgrade to Pro ($14/mo) — that's less than the hourly rate you lost the last time a client said "I thought this was included."

---

## SUMMARY: WEEK 1 PRIORITY ORDER

1. Post Reddit value thread Day 1 (organic SEO + authority)
2. Post build-in-public Twitter thread Day 1
3. DM 5 Reddit users Day 4
4. Send Sequence A to 20 targeted LinkedIn freelancers
5. Send Sequence B to 5 community owners / newsletter writers
6. Check: did anyone generate a proposal? If yes — DM them personally for feedback
7. End of week: post metrics publicly (creates accountability + attracts more users)
