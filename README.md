# MOHALLO — Antigravity Redesign V2

This is the Mohallo redesign handoff built specifically around the uploaded existing website code and the supplied requirements.

## The requested change set

1. Keep the existing Mohallo loading logo/loader exactly as it is.
2. Redesign the website UI/UX instead of replacing the product concept.
3. Change merchant onboarding from one long form into 3 clear steps:
   - Personal Information
   - Shop Information
   - Payment & Integration
4. Set the merchant subscription choices to:
   - ₹199/month
   - ₹399/month
5. Defer buyer/customer integration decisions until the merchant side is stabilized.
6. Prepare a payment architecture that can support the intended methods without exposing gateway secrets in frontend code.
7. Do not invent what “BMSCI” means. It remains an unresolved external integration name until the team provides the exact provider/product/API documentation.

## Existing site

The original source is preserved in `existing-site/`.

Antigravity should inspect and modify the existing implementation rather than rebuilding from a blank project.

## Start here

Read:
- `AGENTS.md`
- `ANTIGRAVITY_START_PROMPT.md`
- `docs/CURRENT_SITE_AUDIT.md`
- `docs/REDESIGN_BRIEF.md`
- `docs/PRD.md`
- `docs/UX_ARCHITECTURE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/SELLER_ONBOARDING.md`
- `docs/PAYMENTS_ARCHITECTURE.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/QA_ACCEPTANCE.md`

## Source of truth hierarchy

1. Explicit user requirements in the latest task.
2. Existing functional behavior in `existing-site/`.
3. Mohallo master context.
4. Unresolved items remain unresolved until explicitly decided.

## Important

Do not silently convert assumptions into production functionality.

Do not put gateway secrets in HTML/JS.

Do not alter the loading logo.
