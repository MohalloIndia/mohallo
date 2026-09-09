# Mohallo Redesign — Execute This

You are working on an existing Mohallo website.

## Read first

- `AGENTS.md`
- `docs/CURRENT_SITE_AUDIT.md`
- `docs/REDESIGN_BRIEF.md`
- `docs/PRD.md`
- `docs/UX_ARCHITECTURE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/SELLER_ONBOARDING.md`
- `docs/PAYMENTS_ARCHITECTURE.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/QA_ACCEPTANCE.md`

Then inspect `existing-site/` and the actual repository you are operating on.

## Mission

Perform a complete UI/UX redesign of the existing Mohallo website while preserving working product behavior.

### Hard requirements

1. KEEP THE CURRENT LOADING LOGO EXACTLY THE SAME.
2. Redesign the visual system and information hierarchy.
3. Replace the old single long seller form with a 3-step seller flow:
   1. Personal Information
   2. Shop Information
   3. Payment & Integration
4. Change subscriptions to:
   - ₹199/month
   - ₹399/month
5. Buyer/customer integration is out of scope for this phase. Do not expand buyer functionality unless needed to keep existing functionality working.
6. Prepare payment UX for PayPal / Google Pay / Paytm / PhonePe through an appropriate gateway/provider abstraction.
7. Do not invent or implement “BMSCI” until its exact provider/API identity is provided.
8. Never expose payment secrets in client-side code.

## Phase A — Audit

Audit current:
- homepage
- navigation
- loader
- hero
- plans
- seller modal
- marketplace
- seller dashboard
- payment functions
- mobile layouts

Create a short audit in your response before the implementation summary.

## Phase B — Redesign

### Homepage

Reframe the site around:

> Your local business deserves a digital shop.

Primary CTA:
**Create your shop**

Secondary CTA:
**Explore local shops**

Visual hierarchy should feel significantly more polished than the current version.

Keep the loader unchanged.

### Navigation

Make the current navigation cleaner and more purposeful.

Recommended:
- Home
- Explore
- How it works
- Plans
- About
- Seller Login
- Create your shop

Do not make “Delivery” a major navigation item unless the existing product truly supports the promised experience.

### Plans

Create two clear plan cards:
- ₹199/month
- ₹399/month

Make the difference obvious.

Do not invent specific benefits as factual production capabilities. Where benefits are not finalized, use restrained language or configuration-driven placeholders.

### Seller onboarding

Use a modal or dedicated flow with a visible progress indicator.

Step 1:
Personal Information

Step 2:
Shop Information

Step 3:
Payment & Integration

Use “Back” and “Continue” controls.

On the final step, show plan choice and payment method.

Do not ask for sensitive data earlier than necessary.

### Payment

Keep the checkout architecture provider-agnostic.

For Indian subscriptions, use the configured provider's supported UPI/card methods.

Do not claim PayPal supports domestic Indian payments. PayPal's India guidance states domestic payments cannot be received; it is intended for international payments. Use it only where the business/payment model actually qualifies.

### Dashboard

Redesign the seller dashboard so the first screen answers:
- Is my shop live?
- What needs attention?
- What have customers done?
- What should I do next?

Keep the current functional product/order behavior.

## Phase C — Verification

Run:
- lint/type checks if available
- build
- tests
- browser verification

Check:
- loader unchanged
- subscription values are exactly ₹199/₹399
- three-step seller flow works on mobile
- values survive Back/Continue
- validation works
- payment cancellation/retry works
- no secrets are introduced
- no broken marketplace/dashboard routes

## Final response

Report:
- audit findings
- redesigned screens
- components changed/added
- functionality preserved
- subscription changes
- payment architecture status
- tests/checks run
- remaining issues
