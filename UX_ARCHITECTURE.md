# Mohallo UX Architecture — V2

## Global

Desktop:
Logo | Home | Explore | How it works | Plans | About | Seller Login | Create your shop

Mobile:
Logo | menu | primary merchant CTA

## Seller signup flow

### Step 1 — Personal Information

Goal:
establish the account owner.

Fields:
- full name
- phone
- password/credential fields required by current auth design

Primary:
Continue

Secondary:
Back/cancel only when applicable

### Step 2 — Shop Information

Goal:
establish the merchant storefront.

Fields:
- shop name
- business type/category
- address
- other existing shop metadata

Primary:
Continue to payment

Secondary:
Back

### Step 3 — Payment & Integration

Goal:
choose a subscription and payment route.

Show:
- ₹199 plan
- ₹399 plan
- payment methods available through configured providers
- payout/payment integration data only where necessary
- terms/consent
- secure payment explanation

Primary:
Continue to secure payment

Secondary:
Back

## State transitions

Step:
idle → editing → validation error → valid → next

Payment:
ready → checkout opening → awaiting payment → verifying → success
or
ready → checkout opening → cancelled/failed → retry

## Success

Show:
- shop setup received/completed
- subscription state
- dashboard CTA
- next setup action

## Dashboard

Top:
shop status
plan
next best action

Middle:
orders/enquiries
catalog
activity

Bottom:
analytics / future Autopilot

## Marketplace

Keep customer experience simple for this phase:
- search
- result cards
- shop
- product
- existing order flow

Do not make buyer integration the focus of the redesign.
