# Mohallo Redesign Implementation Plan

## P0 — Foundation

1. Preserve loader exactly.
2. Normalize tokens.
3. Redesign navigation.
4. Redesign global button/form/card primitives.

## P0 — Homepage

1. New hero
2. product visual
3. merchant journey
4. value proposition
5. plans
6. final CTA

## P0 — Seller onboarding

1. Extract current form fields.
2. Split into 3 steps.
3. Add stepper/progress.
4. Add step validation.
5. Preserve values.
6. Move payment to final step.
7. Update plan values.
8. Add trustworthy payment states.

## P1 — Dashboard

1. Add shell/navigation.
2. Add shop status.
3. Add next action.
4. Improve product management.
5. Improve order visibility.
6. Add subscription card.

## P1 — Marketplace

Improve:
- search
- shop cards
- loading
- empty
- errors
- modal/shop presentation

Keep buyer integration out of scope.

## P2 — Payment provider abstraction

1. Isolate provider logic.
2. Make plans server-authoritative.
3. Verify payment server-side.
4. Add webhook/event path.
5. Add provider capability configuration.

Do not implement unknown “BMSCI”.

## P3 — Polish

- mobile
- accessibility
- motion
- microcopy
- empty/error/success states
- browser QA
