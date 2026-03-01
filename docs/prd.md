# ScopeShield — Product Requirements Document

## Product overview
ScopeShield is a solo-built SaaS for freelance developers, designers, and consultants.
It generates a professional Proposal + Statement of Work (SOW) + Change Request Email in under 2 minutes using a structured Scope Builder form + AI polishing.

**Tagline**: Write proposals in 2 minutes. Lock scope forever.

## Target persona
- Freelance developers, designers, consultants billing $50–$200/hr
- 1–5 active clients at any time
- Loses time and money to vague proposals and scope creep
- Not looking for Proposify (agency-priced, bloated)
- Wants something fast, affordable, and purpose-built for solo work

## Problem statement
Freelancers lose $15,000–$25,000/year to scope creep because:
1. Proposals are vague ("build a website" without specifics)
2. SOWs are missing or copy-pasted from outdated templates
3. No standardized scope change process to fall back on

## Solution
1. Structured **Scope Builder** form with checkbox presets (deliverables, exclusions, acceptance criteria, assumptions) by project type
2. **AI polishing** (Claude Haiku) converts the structured scope into professional Proposal + SOW + Change Request Email
3. **DOCX download** — editable by client, ready to sign

## User stories (MVP)
- [x] As a freelancer, I can fill out a Scope Builder form with preset checkboxes and generate a polished Proposal + SOW + Change Request Email in under 2 minutes
- [x] As a free user, I can generate up to 3 proposals/month (watermarked DOCX download)
- [x] As a Pro user ($14/month), I can generate unlimited proposals with clean DOCX downloads
- [x] As any user, I can view past proposals in my dashboard
- [x] As a paying user, I can manage my subscription via Stripe Billing Portal
- [x] All documents include "Not legal advice." disclaimer

## Non-goals (MVP)
- E-signature / client portal
- Multi-user teams
- Invoice generation
- CRM integration
- Email delivery of proposals
- Mobile native app
- PDF export (v2)

## Success metrics (Day 60)
- 10+ paying customers
- <30% churn in first billing cycle
- NPS ≥ 7 from first 20 users
- 90%+ uptime on /api/generate

## Disclaimer
All generated documents are for business communication purposes only.
**Not legal advice.** ScopeShield does not provide legal advice of any kind.
