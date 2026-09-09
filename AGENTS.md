# Mohallo Antigravity Workspace Instructions — V2

You are redesigning the existing Mohallo website as a senior product designer + frontend engineer.

## Absolute non-negotiables

### 1. Preserve the loading logo

The current loading logo/loader is a deliberate brand element.

Do not:
- redesign it
- replace it
- recolor it without instruction
- change its symbol treatment
- replace its animation
- remove it

You may adjust surrounding layout only if necessary.

### 2. Redesign the product UI/UX, not the product identity

The current product direction is local digital shops with local discovery and future automation.

The redesign should make the website feel:
- modern
- credible
- local
- clean
- operationally useful

Avoid generic “AI startup” styling.

### 3. Merchant is the priority

The immediate product priority is the seller/merchant journey.

Buyer/customer integration is intentionally deferred for a later product phase.

### 4. Seller onboarding must be a 3-step flow

Use this exact high-level sequence:

Step 1 — Personal Information
- name
- phone
- password/account credentials as required

Step 2 — Shop Information
- shop name
- business category/type
- business address
- other shop fields that already exist in the product

Step 3 — Payment & Integration
- subscription selection: ₹199 or ₹399 monthly
- payment method
- payout/payment integration details
- required consent/confirmation

Do not show all three groups as one long form.

The user must be able to:
- see progress
- go back
- continue
- understand what remains
- recover from validation errors
- keep already entered information

### 5. Subscription is currently ₹199 / ₹399

Replace the old ₹300 / ₹1000 prototype.

Use:
- ₹199/month
- ₹399/month

Make plan benefits data-driven.

Do not hardcode plan meaning in multiple files.

### 6. Payments

The user requested support for PayPal, Google Pay, Paytm, and PhonePe, with an additional reference to “BMSCI”.

Do not invent BMSCI's identity.

Architect payment selection through a provider abstraction.

Important payment principle:
- gateway secrets stay server-side
- payment success must be verified server-side
- client UI must never mark a subscription paid only because checkout returned successfully

### 7. Keep functional backend behavior

Inspect and reuse:
- Supabase authentication/data
- Netlify functions
- existing database calls
- existing marketplace/dashboard logic

Don't rebuild working backend infrastructure simply because the UI is being redesigned.

## Existing source audit first

Before writing code:
- inspect all files in `existing-site/`
- run the site
- identify current routes
- inspect current styles
- identify current signup form
- identify current payment code
- check current loading logo
- map the current merchant and marketplace flow

Then implement.

## 60–30–10 rule

Use:
- 60% neutral/background foundation
- 30% secondary surfaces/navigation/content
- 10% brand accent/action emphasis

Do not create visual noise with constant accent-colored components.

## Responsive

Verify:
- 360
- 390
- 768
- 1024
- 1440+

## Accessibility

Require:
- keyboard navigation
- visible focus
- semantic buttons
- labeled inputs
- clear validation
- reduced motion support
- useful error messages

## Quality bar

A redesign is not complete when it merely looks good.

It is complete when:
- merchant onboarding is easier
- the subscription choice is clearer
- the site hierarchy is clearer
- existing functional flows still work
- mobile behavior is strong
- payment states are trustworthy
