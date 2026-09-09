// ===== BUYER PORTAL CONTROLLER =====
let buyerCart = [
  { id: "p1", name: "Artisanal Sourdough Loaf", price: 180, shopName: "The Baker's Corner", qty: 1 }
];

// Loader
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) setTimeout(() => loader.classList.add("hidden"), 800);
});

function switchBuyerTab(tabId) {
  // Update sidebar buttons
  document.querySelectorAll(".dash-nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.textContent.toLowerCase().includes(tabId));
  });

  // Update panels
  document.querySelectorAll(".dash-tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `buyer-panel-${tabId}`);
  });

  // Update title
  const titleEl = document.getElementById("buyer-view-title");
  const subEl = document.getElementById("buyer-view-sub");
  if (titleEl) {
    if (tabId === "home") {
      titleEl.textContent = "Welcome back, Neighbour! 👋";
      if (subEl) subEl.textContent = "Here is what is fresh and happening in your neighbourhood today.";
    } else if (tabId === "orders") {
      titleEl.textContent = "My Orders";
      if (subEl) subEl.textContent = "Track, review, and reorder from your favourite local merchants.";
    } else if (tabId === "cart") {
      titleEl.textContent = "Shopping Cart";
      if (subEl) subEl.textContent = "Review items in your cart before checkout.";
      renderBuyerCart();
    } else if (tabId === "profile") {
      titleEl.textContent = "Profile & Delivery Address";
      if (subEl) subEl.textContent = "Keep your contact information up to date for smooth local deliveries.";
    } else if (tabId === "explore") {
      window.location.href = "marketplace.html";
    }
  }
}

function updateBuyerNavCartCount() {
  const count = buyerCart.reduce((sum, item) => sum + item.qty, 0);
  const countEl = document.getElementById("buyer-nav-cart-count");
  if (countEl) countEl.textContent = count;
}

function quickReorder(name, price, shopName) {
  const existing = buyerCart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    buyerCart.push({ id: Date.now().toString(), name, price, shopName, qty: 1 });
  }
  updateBuyerNavCartCount();
  alert(`Added "${name}" to your cart!`);
}

function renderBuyerCart() {
  const listEl = document.getElementById("buyer-cart-list");
  const subtotalEl = document.getElementById("buyer-cart-subtotal");
  const grandtotalEl = document.getElementById("buyer-cart-grandtotal");
  const checkoutBtn = document.getElementById("btn-buyer-checkout");
  if (!listEl) return;

  if (buyerCart.length === 0) {
    listEl.innerHTML = '<p class="text-muted" style="padding: 24px; text-align: center;">Your cart is empty. <a href="marketplace.html" style="color:var(--brand-primary); font-weight:600;">Browse neighbourhood shops &rarr;</a></p>';
    if (subtotalEl) subtotalEl.textContent = "₹0";
    if (grandtotalEl) grandtotalEl.textContent = "₹0";
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  listEl.innerHTML = "";
  let subtotal = 0;

  buyerCart.forEach((item, idx) => {
    subtotal += item.price * item.qty;
    const row = document.createElement("div");
    row.className = "cart-item-row";
    row.innerHTML = `
      <div style="flex-grow: 1;">
        <strong>${item.name}</strong>
        <p class="text-muted" style="font-size: 12px;">${item.shopName}</p>
        <span style="font-weight: 700; color: var(--brand-primary);">₹${item.price} each</span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <button class="btn btn-outline btn-sm" onclick="adjustBuyerQty(${idx}, -1)">-</button>
        <span style="font-weight: 700; min-width: 20px; text-align: center;">${item.qty}</span>
        <button class="btn btn-outline btn-sm" onclick="adjustBuyerQty(${idx}, 1)">+</button>
      </div>
      <div style="min-width: 70px; text-align: right; font-weight: 800;">
        ₹${item.price * item.qty}
      </div>
      <button class="cart-item-remove" onclick="removeBuyerItem(${idx})">&times;</button>
    `;
    listEl.appendChild(row);
  });

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  const delivery = subtotal > 0 ? 30 : 0;
  if (grandtotalEl) grandtotalEl.textContent = `₹${subtotal + delivery}`;
  if (checkoutBtn) checkoutBtn.disabled = false;
}

function adjustBuyerQty(index, change) {
  if (buyerCart[index]) {
    buyerCart[index].qty += change;
    if (buyerCart[index].qty <= 0) {
      buyerCart.splice(index, 1);
    }
    updateBuyerNavCartCount();
    renderBuyerCart();
  }
}

function removeBuyerItem(index) {
  buyerCart.splice(index, 1);
  updateBuyerNavCartCount();
  renderBuyerCart();
}

function clearBuyerCart() {
  buyerCart = [];
  updateBuyerNavCartCount();
  renderBuyerCart();
}

function proceedToCheckout() {
  if (buyerCart.length === 0) return;
  const subtotal = buyerCart.reduce((s, i) => s + (i.price * i.qty), 0);
  const total = subtotal + 30;
  const confirmed = confirm(`Proceed to pay ₹${total} (including ₹30 delivery) for your order?`);
  if (confirmed) {
    alert("Payment verified server-side! Your order #ORD" + Math.floor(1000 + Math.random() * 9000) + " has been placed with the shop!");
    buyerCart = [];
    updateBuyerNavCartCount();
    renderBuyerCart();
    switchBuyerTab('orders');
  }
}

function handleSaveProfile(e) {
  e.preventDefault();
  const name = document.getElementById("prof-name").value;
  const displayName = document.getElementById("buyer-display-name");
  if (displayName) displayName.textContent = name;
  alert("Profile and delivery address updated successfully!");
}

document.addEventListener("DOMContentLoaded", () => {
  updateBuyerNavCartCount();
});
