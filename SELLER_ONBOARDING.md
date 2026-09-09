# Seller Onboarding Specification

## Goal

Replace the current one-page seller form with a three-stage setup experience.

## Step 1 — Personal Information

Required:
- full name
- phone number
- password/credential requirements from existing auth

UX:
- concise
- no shop/payment questions yet
- inline validation
- Continue button

## Step 2 — Shop Information

Required:
- shop name
- business type/category
- shop/business address

UX:
- show a tiny preview of the shop identity where practical
- explain that this becomes the public shop information
- Back / Continue

## Step 3 — Payment & Integration

Plan selector:
### ₹199/month
Basic entry plan

### ₹399/month
Higher-capability plan

Do not invent exact feature entitlements unless they are explicitly approved. Keep the plan config centralized.

Payment methods:
Show only methods enabled by the chosen payment provider configuration.

The UI may visually group:
- UPI
- Cards
- PayPal (where applicable)
- other configured methods

Do not represent separate UPI apps as separate infrastructure integrations unless the provider actually requires that.

## Sensitive payment/payout data

Do not request sensitive payout/bank details merely because the UI needs a payment section.

Only request data that the actual payment/payout provider requires.

When provider requirements are unknown, keep the UI to a provider-connect placeholder instead of collecting speculative banking data.

## Progress persistence

When navigating:
- forward
- back
- errors
- payment cancellation

preserve non-sensitive form values.

Never persist secrets in localStorage.

## Completion

After successful payment verification:
- update subscription state
- show success
- provide dashboard CTA

Never show “paid” purely from client-side checkout callback.
