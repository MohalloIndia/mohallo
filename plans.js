/**
 * Mohallo Centralized Subscription Plans
 * Authoritative client-side plan configuration for pricing, features, and UI rendering.
 */
const MOHALLO_PLANS = {
  "199": {
    id: "199",
    key: "starter",
    name: "Starter",
    price: 199,
    priceInPaise: 19900,
    currency: "INR",
    symbol: "₹",
    interval: "month",
    periodLabel: "/month",
    badge: "Essential",
    tagline: "For neighbourhood businesses starting online",
    description: "Launch your verified digital storefront, list your inventory, and start connecting with local customers today.",
    features: [
      "Your own branded digital storefront URL",
      "List up to 50 active products / services",
      "Local neighbourhood search & discovery",
      "Direct customer order notifications",
      "0% platform commission on direct sales",
      "Real-time order tracker & merchant dashboard",
      "Standard merchant support"
    ],
    highlightFeature: "Best for home kitchens, crafters & solo shops",
    ctaText: "Start with ₹199/mo",
    popular: false
  },
  "399": {
    id: "399",
    key: "growth",
    name: "Growth",
    price: 399,
    priceInPaise: 39900,
    currency: "INR",
    symbol: "₹",
    interval: "month",
    periodLabel: "/month",
    badge: "Recommended",
    tagline: "For active sellers wanting maximum local reach",
    description: "Enhanced local exposure, priority placement in search, and advanced management tools to grow your customer base.",
    features: [
      "Everything included in Starter",
      "Unlimited product & service listings",
      "Priority placement in local marketplace search",
      "Featured 'Verified Local Merchant' badge",
      "Promotional highlights & storefront banners",
      "Detailed customer order history & reports",
      "Priority merchant assistance & onboarding"
    ],
    highlightFeature: "Best for growing retailers, bakeries & boutiques",
    ctaText: "Choose Growth for ₹399/mo",
    popular: true
  }
};

const MohalloPlansHelper = {
  getPlan(planId) {
    const id = String(planId || "199");
    return MOHALLO_PLANS[id] || MOHALLO_PLANS["199"];
  },
  getAllPlans() {
    return Object.values(MOHALLO_PLANS);
  },
  formatPrice(planId) {
    const plan = this.getPlan(planId);
    return `${plan.symbol}${plan.price}${plan.periodLabel}`;
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { MOHALLO_PLANS, MohalloPlansHelper };
}
