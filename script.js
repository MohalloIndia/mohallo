// ===== SUPABASE & ENVIRONMENT CONNECTION =====
const SUPABASE_URL = "https://lsoyjkuyvijzxqhitgbx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxzb3lqa3V5dmlqenhxaGl0Z2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NjA3NzYsImV4cCI6MjEwMzEzNjc3Nn0.dvzaAhF_EJqzx3MPAClGlORSdiyWJUmG1U2LYuO-FO0";
const RAZORPAY_KEY_ID = "rzp_test_TVElHzGAS60nJc";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================================================
// NON-NEGOTIABLE REQUIREMENT:
// KEEP THE CURRENT MOHALLO LOADING LOGO EXACTLY AS IT IS.
// Do not redesign, replace, recolor, animate differently, or remove it.
// ==========================================================================
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;
  setTimeout(() => loader.classList.add("hidden"), 1200);
});

// Navbar scroll styling
const navbar = document.getElementById("navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  });
}

// Mobile Menu Drawer
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const menuBackdrop = document.getElementById("menu-backdrop");

function openMobileMenu() {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.classList.add("active");
  mobileMenu.classList.add("active");
  if (menuBackdrop) menuBackdrop.classList.add("active");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.classList.remove("active");
  mobileMenu.classList.remove("active");
  if (menuBackdrop) menuBackdrop.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("active");
    if (isOpen) closeMobileMenu();
    else openMobileMenu();
  });
}

// Copyright year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Password visibility toggle
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
    btn.textContent = "🔒";
  } else {
    input.type = "password";
    btn.textContent = "👁️";
  }
}

// Plans Monthly/Yearly switch on Homepage (Screen 8)
function switchBillingPeriod(period) {
  const btnMonthly = document.getElementById("btn-toggle-monthly");
  const btnYearly = document.getElementById("btn-toggle-yearly");
  const priceStarter = document.getElementById("price-starter");
  const priceGrowth = document.getElementById("price-growth");

  if (period === "yearly") {
    btnYearly.classList.add("active");
    btnMonthly.classList.remove("active");
    if (priceStarter) priceStarter.innerHTML = "₹169<span style='font-size:14px; font-weight:normal; color:var(--text-muted);'>/mo (billed yearly)</span>";
    if (priceGrowth) priceGrowth.innerHTML = "₹339<span style='font-size:14px; font-weight:normal; color:var(--text-muted);'>/mo (billed yearly)</span>";
  } else {
    btnMonthly.classList.add("active");
    btnYearly.classList.remove("active");
    if (priceStarter) priceStarter.textContent = "₹199";
    if (priceGrowth) priceGrowth.textContent = "₹399";
  }
}

// Buyer Auth Modal
const buyerAuthModal = document.getElementById("buyer-auth-modal");

function openBuyerAuthModal() {
  if (!buyerAuthModal) return;
  buyerAuthModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeBuyerAuthModal() {
  if (!buyerAuthModal) return;
  buyerAuthModal.classList.remove("active");
  document.body.style.overflow = "";
}

function handleBuyerAuth(e) {
  e.preventDefault();
  const phone = document.getElementById("buyer-phone").value.trim();
  const pass = document.getElementById("buyer-password").value;
  if (phone.replace(/\D/g, "").length !== 10 || !pass) {
    document.getElementById("buyer-auth-error").textContent = "Please enter a valid 10-digit mobile number and password.";
    return;
  }
  closeBuyerAuthModal();
  window.location.href = "buyer-dashboard.html";
}

// ==========================================================================
// SELLER ONBOARDING WIZARD (Screens 5, 6, 7 from Design Board)
// ==========================================================================

let currentOnboardingStep = 1;
const onboardingState = {
  name: "",
  phone: "",
  password: "",
  shopName: "",
  category: "Bakery & Food",
  address: "",
  planId: "199",
  paymentMethod: "upi"
};

const signupModal = document.getElementById("signup-modal");
const signupForm = document.getElementById("signup-form");
const modalSuccess = document.getElementById("modal-success");

function openSignupModal(preferredPlanId) {
  if (!signupModal) return;
  signupModal.classList.add("active");
  document.body.style.overflow = "hidden";

  if (preferredPlanId && (preferredPlanId === "199" || preferredPlanId === "399")) {
    selectModalPlan(preferredPlanId);
  }

  goToStep(1);
  clearAllErrors();
}

function closeSignupModal() {
  if (!signupModal) return;
  signupModal.classList.remove("active");
  document.body.style.overflow = "";
}

// Close on backdrop click & ESC
if (signupModal) {
  signupModal.addEventListener("click", (e) => {
    if (e.target === signupModal) closeSignupModal();
  });
}
if (buyerAuthModal) {
  buyerAuthModal.addEventListener("click", (e) => {
    if (e.target === buyerAuthModal) closeBuyerAuthModal();
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSignupModal();
    closeBuyerAuthModal();
  }
});

// Plan selection inside Step 3
function selectModalPlan(planId) {
  onboardingState.planId = String(planId);
  const hiddenInput = document.getElementById("selected-plan-id");
  if (hiddenInput) hiddenInput.value = onboardingState.planId;

  const card199 = document.getElementById("plan-choice-199");
  const card399 = document.getElementById("plan-choice-399");

  if (card199 && card399) {
    if (onboardingState.planId === "199") {
      card199.classList.add("selected");
      card399.classList.remove("selected");
      const r1 = card199.querySelector("input[type='radio']");
      if (r1) r1.checked = true;
    } else {
      card399.classList.add("selected");
      card199.classList.remove("selected");
      const r2 = card399.querySelector("input[type='radio']");
      if (r2) r2.checked = true;
    }
  }
}

// Step Navigation
function goToStep(stepNumber) {
  currentOnboardingStep = stepNumber;

  // Update panels
  document.querySelectorAll(".onboarding-step").forEach((panel, idx) => {
    panel.classList.toggle("active", idx + 1 === stepNumber);
  });

  // Update Stepper Nodes
  for (let i = 1; i <= 3; i++) {
    const node = document.getElementById(`step-node-${i}`);
    const circle = document.getElementById(`step-circle-${i}`);
    if (!node || !circle) continue;

    node.classList.remove("active", "completed");
    if (i < stepNumber) {
      node.classList.add("completed");
      circle.textContent = "✓";
    } else if (i === stepNumber) {
      node.classList.add("active");
      circle.textContent = `0${i}`;
    } else {
      circle.textContent = `0${i}`;
    }
  }

  clearAllErrors();
}

function handleStepBack() {
  if (currentOnboardingStep > 1) {
    saveCurrentStepData();
    goToStep(currentOnboardingStep - 1);
  }
}

function saveCurrentStepData() {
  if (currentOnboardingStep === 1) {
    const nameEl = document.getElementById("seller-name");
    const phoneEl = document.getElementById("seller-phone");
    const passEl = document.getElementById("seller-password");
    if (nameEl) onboardingState.name = nameEl.value.trim();
    if (phoneEl) onboardingState.phone = phoneEl.value.trim();
    if (passEl) onboardingState.password = passEl.value;
  } else if (currentOnboardingStep === 2) {
    const shopEl = document.getElementById("shop-name");
    const catEl = document.getElementById("shop-category");
    const addrEl = document.getElementById("seller-address");
    if (shopEl) onboardingState.shopName = shopEl.value.trim();
    if (catEl) onboardingState.category = catEl.value;
    if (addrEl) onboardingState.address = addrEl.value.trim();
  }
}

function clearAllErrors() {
  document.querySelectorAll(".form-error").forEach((el) => (el.textContent = ""));
  document.querySelectorAll(".form-group input, .form-group select").forEach((el) => el.classList.remove("invalid"));
}

function setFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errorId);
  if (input) input.classList.add("invalid");
  if (err) err.textContent = message;
}

function validateStep1() {
  saveCurrentStepData();
  clearAllErrors();
  let isValid = true;

  if (onboardingState.name.length < 2) {
    setFieldError("seller-name", "error-name", "Please enter your full name.");
    isValid = false;
  }

  const digits = onboardingState.phone.replace(/\D/g, "");
  if (digits.length !== 10) {
    setFieldError("seller-phone", "error-phone", "Enter a valid 10-digit mobile number.");
    isValid = false;
  }

  if (onboardingState.password.length < 6) {
    setFieldError("seller-password", "error-password", "Password must be at least 6 characters.");
    isValid = false;
  }

  return isValid;
}

function validateStep2() {
  saveCurrentStepData();
  clearAllErrors();
  let isValid = true;

  if (onboardingState.shopName.length < 2) {
    setFieldError("shop-name", "error-shop", "Please enter your shop name.");
    isValid = false;
  }

  if (onboardingState.address.length < 5) {
    setFieldError("seller-address", "error-address", "Please provide complete shop address.");
    isValid = false;
  }

  return isValid;
}

function validateStep3() {
  clearAllErrors();
  return true;
}

async function handleStepNext() {
  if (currentOnboardingStep === 1) {
    if (validateStep1()) goToStep(2);
  } else if (currentOnboardingStep === 2) {
    if (validateStep2()) goToStep(3);
  } else if (currentOnboardingStep === 3) {
    if (validateStep3()) {
      await executeSellerRegistrationAndPayment();
    }
  }
}

// Payment selection in Step 3
document.addEventListener("change", (e) => {
  if (e.target && e.target.name === "payment_method_radio") {
    document.querySelectorAll(".payment-radio-row").forEach((row) => row.classList.remove("selected"));
    const parentRow = e.target.closest(".payment-radio-row");
    if (parentRow) parentRow.classList.add("selected");
    onboardingState.paymentMethod = e.target.value;
  }
});

async function executeSellerRegistrationAndPayment() {
  const globalErr = document.getElementById("error-step3-global");
  const payBtn = document.getElementById("btn-pay-continue");
  if (payBtn) {
    payBtn.disabled = true;
    payBtn.textContent = "Processing...";
  }

  try {
    const cleanPhone = onboardingState.phone.replace(/\D/g, "");
    const virtualEmail = `${cleanPhone}@mohalloseller.app`;

    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email: virtualEmail,
      password: onboardingState.password,
      options: {
        data: {
          name: onboardingState.name,
          phone: onboardingState.phone,
          shop_name: onboardingState.shopName,
          category: onboardingState.category,
          plan: onboardingState.planId
        }
      }
    });

    let userId = authData?.user?.id;

    if (authError) {
      if (authError.message && authError.message.toLowerCase().includes("already registered")) {
        const { data: signInData, error: signInErr } = await supabaseClient.auth.signInWithPassword({
          email: virtualEmail,
          password: onboardingState.password
        });
        if (signInErr || !signInData?.user) {
          throw new Error("This phone number is already registered. Please login to your dashboard.");
        }
        userId = signInData.user.id;
      } else {
        throw new Error(authError.message || "Failed to create account. Please try again.");
      }
    }

    const sellerPayload = {
      user_id: userId,
      name: onboardingState.name,
      phone: onboardingState.phone,
      shop_name: onboardingState.shopName,
      plan: onboardingState.planId,
      address: onboardingState.address,
      payment_status: "pending",
      payout_status: "pending_verification"
    };

    await supabaseClient.from("sellers").upsert(sellerPayload, { onConflict: "user_id" });

    const orderData = await MohalloPaymentService.createMembershipOrder(onboardingState.planId, onboardingState.phone);

    MohalloPaymentService.launchCheckout({
      order: orderData,
      sellerInfo: onboardingState,
      planId: onboardingState.planId,
      onVerified: async (verification) => {
        await supabaseClient.from("sellers").update({
          payment_status: "paid",
          membership_payment_id: verification.payment_id
        }).eq("user_id", userId);

        showOnboardingSuccess();
      },
      onCancel: () => {
        if (payBtn) {
          payBtn.disabled = false;
          payBtn.textContent = "Pay & Continue";
        }
        if (globalErr) globalErr.textContent = "Payment cancelled. You can try again anytime.";
      },
      onError: (err) => {
        if (payBtn) {
          payBtn.disabled = false;
          payBtn.textContent = "Pay & Continue";
        }
        if (globalErr) globalErr.textContent = err.message || "Payment could not be completed.";
      }
    });

  } catch (err) {
    console.error("Onboarding error:", err);
    if (payBtn) {
      payBtn.disabled = false;
      payBtn.textContent = "Pay & Continue";
    }
    if (globalErr) globalErr.textContent = err.message || "An error occurred during setup.";
  }
}

function showOnboardingSuccess() {
  if (signupForm) signupForm.style.display = "none";
  if (modalSuccess) modalSuccess.classList.add("active");
  
  const msg = document.getElementById("success-message");
  if (msg) {
    const plan = typeof MohalloPlansHelper !== "undefined" 
      ? MohalloPlansHelper.getPlan(onboardingState.planId) 
      : { name: "Seller Plan", price: onboardingState.planId };
    msg.textContent = `Your ${plan.name} Plan (₹${plan.price}/month) is active! Your digital shop is now configured and live in your neighbourhood.`;
  }
}
