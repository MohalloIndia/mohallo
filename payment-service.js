/**
 * Mohallo Payment Provider Abstraction Layer
 * 
 * Provides unified payment interface for:
 * - Razorpay (Active provider for Indian Domestic UPI: Google Pay, PhonePe, Paytm, BHIM, Cards, Netbanking)
 * - PayPal (Reserved for international payment flows per Indian regulatory guidance; domestic INR not supported)
 * - BMSCI (Provider not yet configured - API specifications and credentials pending from team; do NOT fabricate)
 * 
 * Security:
 * - Gateway secrets are NEVER stored in frontend code.
 * - Server-side verification is strictly enforced via Netlify functions before any state change.
 */

const MohalloPaymentService = {
  providers: {
    razorpay: {
      name: "Razorpay (UPI, Google Pay, PhonePe, Paytm, Cards)",
      isConfigured: true,
      keyId: typeof RAZORPAY_KEY_ID !== "undefined" ? RAZORPAY_KEY_ID : "rzp_test_TVElHzGAS60nJc",
      supportedMethods: ["upi", "gpay", "phonepe", "paytm", "card", "netbanking"]
    },
    paypal: {
      name: "PayPal (International Transactions)",
      isConfigured: false,
      notes: "Per RBI & PayPal India policy, domestic INR transactions between Indian accounts cannot be accepted. Reserved for qualifying international cross-border payments.",
      supportedMethods: ["paypal"]
    },
    bmsci: {
      name: "BMSCI Integration",
      isConfigured: false,
      notes: "External provider identity and credentials unverified. Preserved as placeholder without fabricating implementation.",
      supportedMethods: []
    }
  },

  /**
   * Create server-verified order for seller membership
   */
  async createMembershipOrder(planId, phone) {
    const plan = typeof MohalloPlansHelper !== "undefined" 
      ? MohalloPlansHelper.getPlan(planId) 
      : { priceInPaise: planId === "399" ? 39900 : 19900 };
    const sanitizedPhone = String(phone).replace(/\D/g, "");
    
    const response = await fetch("/.netlify/functions/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: plan.priceInPaise,
        receipt: "membership_" + sanitizedPhone + "_" + Date.now().toString().slice(-6)
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to initialize secure checkout order.");
    }

    const orderData = await response.json();
    if (!orderData.order_id) {
      throw new Error("Invalid response from payment gateway.");
    }

    return orderData;
  },

  /**
   * Open checkout modal using configured provider (Razorpay)
   */
  launchCheckout({ order, sellerInfo, planId, onVerified, onCancel, onError }) {
    const plan = typeof MohalloPlansHelper !== "undefined" 
      ? MohalloPlansHelper.getPlan(planId) 
      : { name: "Seller Plan", symbol: "₹", price: planId === "399" ? 399 : 199 };
    const key = this.providers.razorpay.keyId;

    if (typeof Razorpay === "undefined") {
      onError(new Error("Payment SDK failed to load. Please check your network connection and reload."));
      return;
    }

    const options = {
      key: key,
      amount: order.amount,
      currency: order.currency || "INR",
      order_id: order.order_id,
      name: "Mohallo Local",
      description: `${plan.name} Membership (${plan.symbol}${plan.price}/mo) — ${sellerInfo.shopName || "Store"}`,
      image: "images/mohallo-icon.png",
      prefill: {
        name: sellerInfo.name || "",
        contact: sellerInfo.phone || "",
        email: sellerInfo.phone ? `${sellerInfo.phone.replace(/\D/g, "")}@mohalloseller.app` : ""
      },
      theme: {
        color: "#E8622C"
      },
      handler: async (response) => {
        try {
          const verificationResult = await this.verifySignature(response);
          if (verificationResult && verificationResult.verified) {
            onVerified(verificationResult);
          } else {
            onError(new Error("Payment signature verification failed on server."));
          }
        } catch (err) {
          onError(err);
        }
      },
      modal: {
        ondismiss: () => {
          if (onCancel) onCancel();
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", (response) => {
      onError(new Error(response.error?.description || "Payment was declined."));
    });
    rzp.open();
  },

  /**
   * Verify HMAC-SHA256 signature server-side
   */
  async verifySignature(paymentPayload) {
    const res = await fetch("/.netlify/functions/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentPayload)
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Server payment verification failed.");
    }

    return await res.json();
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { MohalloPaymentService };
}
