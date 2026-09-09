# Mohallo Existing Site — Current UI/UX Audit

This audit is based on inspection of the uploaded source and the provided screen recording.

## Current structure

The current project is a compact static web implementation with:
- `index.html`
- `marketplace.html`
- `dashboard.html`
- shared `style.css`
- `script.js`
- `marketplace.js`
- `dashboard.js`
- Netlify serverless payment functions
- Supabase authentication/data usage

## Current strengths

### 1. Clear product direction

The homepage already uses “digital local shop” language. This aligns with the current strategic direction.

### 2. Existing core routes

The product already separates:
- public marketing site
- marketplace
- seller dashboard

That structure should be preserved and improved.

### 3. Existing payment flow

The code already has server-side Netlify functions for order creation and signature verification.

Keep this architecture, but move toward provider abstraction and explicit subscription semantics.

### 4. Existing loading identity

The current loader is distinctive and should remain untouched.

## Current UX problems

### 1. Seller onboarding is overloaded

The existing seller signup combines:
- personal data
- shop data
- bank/payout data
- address
- password
- plan

into one long form.

This is the most obvious UX restructuring opportunity.

### 2. Plan choice is buried

The current form asks for a plan inside the long registration form.

Plan choice should become a deliberate step with clear comparison.

### 3. Marketplace is visually sparse

The provided recording shows a very minimal marketplace state with a lot of unused space.

The discovery experience should become more product-like while remaining honest about available inventory/data.

### 4. Homepage is visually pleasant but too generic

The current design leans on:
- pastel background
- floating cards
- blobs
- emojis
- large section cards

The redesign should be more intentional and product-led.

### 5. Information architecture can be tighter

The current navigation includes “Delivery”, but delivery is a later/uncertain part of the product story.

The navigation should prioritize:
- explore
- merchant signup
- core explanation
- plans

### 6. Seller dashboard is functional but basic

The current dashboard is mainly a form + product list + order list.

It needs:
- status hierarchy
- attention/tasks
- meaningful summary
- better navigation
- clearer merchant identity
- subscription visibility

## Screen-recording observations

The provided screen recording shows the current website being opened and the marketplace route being loaded. The marketplace appears very sparse while content loads, reinforcing the need for stronger loading/empty states.

The recording should be treated as supporting visual evidence, not as a replacement for functional inspection.

## Redesign priority

P0:
- seller onboarding
- plans
- homepage hierarchy
- global navigation
- mobile behavior

P1:
- dashboard
- marketplace visual system
- loading/empty/error states

P2:
- deeper buyer experience, later
