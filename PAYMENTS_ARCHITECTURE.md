# Mohallo Payment Architecture

## Required business pricing

Merchant subscription:
- ₹199/month
- ₹399/month

## Current source architecture

The existing implementation already uses a server-side order creation function and server-side signature verification.

Do not remove server-side verification.

## Recommended abstraction

Create a payment service interface:

```text
PaymentProvider
  createOrder()
  createSubscription()
  openCheckout()
  verifyPayment()
  getPaymentStatus()
  cancelSubscription()
```

Then provide a concrete provider adapter.

## Indian payment experience

For Indian merchants, the product should use the configured gateway's supported Indian methods such as UPI and cards.

Google Pay, PhonePe, and Paytm can be presented as payment options only when the selected gateway/account actually supports the relevant UPI flow.

Do not create fake separate integrations simply because the brand names appear in the UI.

## PayPal

PayPal's India guidance states that domestic payments from Indian customers cannot be received through PayPal, while international payments can be received subject to account/business requirements.

Therefore:
- do not position PayPal as the domestic Indian subscription rail
- support PayPal only for a qualifying international use case

## “BMSCI”

The user referenced “BMSCI” as part of the intended integration.

No trustworthy payment-provider identity for “BMSCI” was established in the available material.

Do not invent an API.

Required next input before implementation:
- full provider name
- website/documentation
- API credentials/environment
- supported payment methods
- webhook specification

## Security

Never expose:
- payment provider secret
- webhook secret
- server credentials

Client-side code may contain only public/publishable identifiers intended for browser use.

## Webhooks

Production subscription state should be driven by verified backend events where the provider offers webhooks.

Expected states:
- pending
- active
- past_due
- cancelled
- failed
- expired

## Plan configuration

Centralize:

```js
const PLANS = {
  basic: { price: 19900, currency: "INR", interval: "monthly" },
  plus: { price: 39900, currency: "INR", interval: "monthly" }
};
```

Use server-side configuration as the final authority.
