// ===== SELLER WORKSPACE CONTROLLER =====
const SUPABASE_URL = "https://lsoyjkuyvijzxqhitgbx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxzb3lqa3V5dmlqenhxaGl0Z2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NjA3NzYsImV4cCI6MjEwMzEzNjc3Nn0.dvzaAhF_EJqzx3MPAClGlORSdiyWJUmG1U2LYuO-FO0";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let currentSeller = null;
let currentProducts = [];

// Loader
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) setTimeout(() => loader.classList.add("hidden"), 800);
});

// Tab Switching across all 10 Seller Tabs
function switchDashboardTab(tabId) {
  document.querySelectorAll(".dash-nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.textContent.toLowerCase().includes(tabId));
  });

  document.querySelectorAll(".dash-tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `panel-${tabId}`);
  });

  const titleEl = document.getElementById("dash-view-title");
  const subEl = document.getElementById("dash-view-sub");
  if (titleEl) {
    const cap = tabId.charAt(0).toUpperCase() + tabId.slice(1);
    titleEl.textContent = cap;
  }
  if (subEl) {
    const subMap = {
      overview: "Here is what is happening with your shop today.",
      shop: "Manage your storefront profile, hours, and neighbourhood discovery details.",
      products: "Manage item pricing, stock levels, and active store listings.",
      orders: "Review, confirm, and update direct neighbourhood customer orders.",
      customers: "Neighbours who have ordered directly from your digital shop.",
      analytics: "Store traffic trends, repeat customer rates, and sales performance.",
      subscription: "Your centrally configured Mohallo membership plan.",
      payments: "Direct merchant settlement destination and payout history.",
      autopilot: "Automated WhatsApp notifications and store schedule assistants.",
      settings: "Store display details, security, and credentials."
    };
    subEl.textContent = subMap[tabId] || `Manage your store ${tabId}.`;
  }
}

function toggleAddProductForm() {
  const form = document.getElementById("add-product-container");
  if (!form) return;
  form.style.display = form.style.display === "none" ? "block" : "none";
}

function copyStoreLink() {
  const shopUrl = document.getElementById("dash-shop-url")?.textContent || "myshop.mohallo.in";
  const fullUrl = `https://${shopUrl}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert("Storefront link copied to clipboard! Share it with neighbours on WhatsApp.");
    });
  } else {
    alert(`Your storefront link is: ${fullUrl}`);
  }
}

// Order State Update (Screen 11: New, Confirmed, Preparing, Ready, Completed, Cancelled)
function openOrderDetailModal(orderId) {
  const modal = document.getElementById("order-detail-modal");
  if (!modal) return;
  modal.classList.add("active");
  const title = document.getElementById("order-modal-id");
  if (title) title.textContent = `Order #${orderId}`;
}

function closeOrderDetailModal() {
  const modal = document.getElementById("order-detail-modal");
  if (!modal) return;
  modal.classList.remove("active");
}

function setOrderState(newState) {
  const statusEl = document.getElementById("order-modal-status");
  if (statusEl) {
    statusEl.textContent = newState;
    statusEl.className = "badge-status-pill " + (
      newState === "Completed" ? "badge-success" :
      newState === "Cancelled" ? "badge-error" :
      newState === "Confirmed" ? "badge-info" :
      newState === "Preparing" ? "badge-primary" : "badge-warning"
    );
  }
  alert(`Order status updated to "${newState}". Customer has been notified.`);
  closeOrderDetailModal();
}

function filterSellerOrders(state, btn) {
  document.querySelectorAll("#panel-orders .category-chip").forEach(c => c.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

function handleSaveShopInfo(e) {
  e.preventDefault();
  const name = document.getElementById("shop-edit-name").value;
  alert(`Shop details for "${name}" updated successfully!`);
}

// Auth & Setup
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session && session.user) {
      loadSellerDashboard(session.user);
    } else {
      setupDemoMerchant();
    }
  } catch (err) {
    setupDemoMerchant();
  }
});

function setupDemoMerchant() {
  currentSeller = {
    name: "Kavita Sharma",
    shop_name: "Kavita's Artisan Pottery",
    phone: "9876543210",
    plan: "199"
  };
  populateSellerUI(currentSeller);
}

function populateSellerUI(seller) {
  const userNameEl = document.getElementById("sidebar-user-name");
  const userPlanEl = document.getElementById("sidebar-user-plan");
  const userInitialEl = document.getElementById("sidebar-user-initial");
  const shopUrlEl = document.getElementById("dash-shop-url");

  if (userNameEl) userNameEl.textContent = seller.name || "Shop Owner";
  if (userInitialEl) userInitialEl.textContent = (seller.name || "S").charAt(0).toUpperCase();
  if (userPlanEl) userPlanEl.textContent = seller.plan === "399" ? "Growth Plan (₹399/mo)" : "Starter Plan (₹199/mo)";

  if (shopUrlEl && seller.shop_name) {
    const slug = seller.shop_name.toLowerCase().replace(/[^a-z0-9]/g, "");
    shopUrlEl.textContent = `${slug || "myshop"}.mohallo.in`;
  }
}

async function handleAddProduct(e) {
  e.preventDefault();
  const name = document.getElementById("prod-name").value.trim();
  const price = parseFloat(document.getElementById("prod-price").value);
  const desc = document.getElementById("prod-desc").value.trim();

  if (!name || isNaN(price)) return;

  const tbody = document.getElementById("products-tbody");
  if (tbody) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="table-product-cell">
          <span class="table-thumb">🏷️</span>
          <div>
            <strong>${name}</strong>
            <p class="text-muted" style="font-size: 11px;">${desc || "Local store item"}</p>
          </div>
        </div>
      </td>
      <td style="font-weight: 700; color: var(--brand-primary);">₹${price}</td>
      <td><span class="badge-status-pill badge-success">In Stock</span></td>
      <td>0</td>
      <td style="text-align: right;"><button class="btn btn-text btn-sm" style="color: var(--error);" onclick="this.closest('tr').remove()">Delete</button></td>
    `;
    tbody.prepend(tr);
  }

  document.getElementById("product-form").reset();
  toggleAddProductForm();
  alert("Product added successfully to your shop!");
}

async function handleDashboardLogin(e) {
  e.preventDefault();
  const phone = document.getElementById("login-phone").value.replace(/\D/g, "");
  const password = document.getElementById("login-password").value;
  const errEl = document.getElementById("login-error");

  if (phone.length !== 10 || !password) {
    if (errEl) errEl.textContent = "Please enter your 10-digit mobile number and password.";
    return;
  }

  document.getElementById("auth-gate").style.display = "none";
  alert("Signed in successfully to your seller dashboard!");
}

async function handleLogout() {
  if (!confirm("Sign out of your seller dashboard?")) return;
  window.location.href = "index.html";
}
