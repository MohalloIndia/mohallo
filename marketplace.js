// ===== MOHALLO MARKETPLACE & COMMERCE CONTROLLER =====
const SHOPS_DATA = {
  "shop-1": {
    name: "The Baker's Corner",
    category: "Food & Drinks",
    location: "Sector 4, Main Market",
    rating: "4.8",
    desc: "Artisanal sourdough, freshly baked croissants, and celebration cakes made daily with natural ingredients.",
    products: [
      { id: "p1", name: "Artisanal Sourdough Loaf", price: 180, icon: "🥖", desc: "Naturally fermented rustic crust sourdough." },
      { id: "p2", name: "Butter Croissants (Box of 2)", price: 160, icon: "🥐", desc: "Flaky French-style butter pastry." },
      { id: "p3", name: "Dark Chocolate Brownie", price: 120, icon: "🍫", desc: "Rich 70% dark cocoa fudge brownie." }
    ]
  },
  "shop-2": {
    name: "GreenMart",
    category: "Grocery",
    location: "Sector 7, Block C",
    rating: "4.6",
    desc: "Direct farm-fresh organic vegetables, pantry staples, and natural honey from regional farmers.",
    products: [
      { id: "p4", name: "Farm Fresh Vegetable Box (3kg)", price: 290, icon: "🥗", desc: "Fresh seasonal greens, tomatoes and herbs." },
      { id: "p5", name: "Cold-Pressed Mustard Oil (1L)", price: 240, icon: "🫒", desc: "Traditional wooden cold-pressed kachi ghani oil." },
      { id: "p6", name: "Pure Mountain Honey (500g)", price: 380, icon: "🍯", desc: "Raw unprocessed multi-flora forest honey." }
    ]
  },
  "shop-3": {
    name: "Crafty Hands",
    category: "Home",
    location: "Sector 11, Artisan Lane",
    rating: "4.7",
    desc: "Handmade ceramic pottery, planters, and home decor crafted by independent neighbourhood artisans.",
    products: [
      { id: "p7", name: "Handmade Ceramic Mug", price: 280, icon: "☕", desc: "Wheel-thrown glazed stoneware mug, 300ml." },
      { id: "p8", name: "Minimalist Clay Planter", price: 360, icon: "🪴", desc: "Hand-crafted terracotta pot for indoor succulents." },
      { id: "p9", name: "Terracotta Serving Bowl", price: 450, icon: "🥣", desc: "Organic earthen dining bowl for curries and salads." }
    ]
  }
};

let activeCategory = "All";
let searchQuery = "";
let cart = [];
let selectedProductForModal = null;
let modalProductQty = 1;

// Loader
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) setTimeout(() => loader.classList.add("hidden"), 800);
});

// Category Filtering
function filterCategory(category, btn) {
  activeCategory = category;
  document.querySelectorAll(".category-chip").forEach((c) => c.classList.remove("active"));
  if (btn) btn.classList.add("active");
  applyMarketFilters();
}

// Search Filtering
function handleSearch(val) {
  searchQuery = val.toLowerCase().trim();
  applyMarketFilters();
}

function applyMarketFilters() {
  const cards = document.querySelectorAll(".shop-card");
  cards.forEach((card) => {
    const cardCat = card.getAttribute("data-category") || "";
    const cardText = card.textContent.toLowerCase();

    const matchesCategory = activeCategory === "All" || cardCat === activeCategory;
    const matchesSearch = !searchQuery || cardText.includes(searchQuery);

    card.style.display = matchesCategory && matchesSearch ? "flex" : "none";
  });
}

// Shop Catalog Modal
function openShopModal(shopId) {
  const shop = SHOPS_DATA[shopId];
  if (!shop) return;

  const modal = document.getElementById("shop-catalog-modal");
  const nameEl = document.getElementById("shop-modal-name");
  const metaEl = document.getElementById("shop-modal-meta");
  const descEl = document.getElementById("shop-modal-desc");
  const itemsContainer = document.getElementById("shop-catalog-items");

  if (nameEl) nameEl.textContent = shop.name;
  if (metaEl) metaEl.textContent = `${shop.category} · ${shop.location} · ★ ${shop.rating}`;
  if (descEl) descEl.textContent = shop.desc;

  if (itemsContainer) {
    itemsContainer.innerHTML = "";
    shop.products.forEach((prod) => {
      const itemEl = document.createElement("div");
      itemEl.className = "shop-product-item";
      itemEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 14px;">
          <span style="font-size: 28px;">${prod.icon || "🏷️"}</span>
          <div class="shop-prod-details">
            <h4 style="font-size: 15px; font-weight: 700;">${prod.name}</h4>
            <p class="text-muted" style="font-size: 12px; margin: 2px 0 4px;">${prod.desc}</p>
            <span class="shop-prod-price">₹${prod.price}</span>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-outline btn-sm" onclick="openProductModal('${prod.id}', '${prod.name}', ${prod.price}, '${prod.desc}', '${prod.icon || "🏷️"}', '${shop.name}')">View</button>
          <button class="btn btn-primary btn-sm" onclick="addToCart('${prod.id}', '${prod.name}', ${prod.price}, '${shop.name}')">+ Add</button>
        </div>
      `;
      itemsContainer.appendChild(itemEl);
    });
  }

  if (modal) modal.classList.add("active");
}

function closeShopModal() {
  const modal = document.getElementById("shop-catalog-modal");
  if (modal) modal.classList.remove("active");
}

// Product Detail Modal
function openProductModal(id, name, price, desc, icon, shopName) {
  selectedProductForModal = { id, name, price, desc, icon, shopName };
  modalProductQty = 1;

  document.getElementById("prod-modal-name").textContent = name;
  document.getElementById("prod-modal-shop").textContent = `By ${shopName}`;
  document.getElementById("prod-modal-price").textContent = `₹${price}`;
  document.getElementById("prod-modal-desc").textContent = desc;
  document.getElementById("prod-modal-icon").textContent = icon;
  document.getElementById("prod-modal-qty").textContent = modalProductQty;
  document.getElementById("prod-modal-total").textContent = `₹${price}`;

  const modal = document.getElementById("product-detail-modal");
  if (modal) modal.classList.add("active");
}

function closeProductModal() {
  const modal = document.getElementById("product-detail-modal");
  if (modal) modal.classList.remove("active");
}

function adjustModalProdQty(change) {
  modalProductQty = Math.max(1, modalProductQty + change);
  document.getElementById("prod-modal-qty").textContent = modalProductQty;
  if (selectedProductForModal) {
    document.getElementById("prod-modal-total").textContent = `₹${selectedProductForModal.price * modalProductQty}`;
  }
}

function confirmAddProductToCart() {
  if (!selectedProductForModal) return;
  for (let i = 0; i < modalProductQty; i++) {
    addToCart(selectedProductForModal.id, selectedProductForModal.name, selectedProductForModal.price, selectedProductForModal.shopName, false);
  }
  closeProductModal();
  updateCartBadge();
  alert(`Added ${modalProductQty}x "${selectedProductForModal.name}" to your cart!`);
}

// Cart Drawer
function toggleCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("cart-backdrop");
  if (!drawer) return;

  const isOpen = drawer.classList.contains("active");
  if (isOpen) {
    drawer.classList.remove("active");
    if (backdrop) backdrop.classList.remove("active");
  } else {
    drawer.classList.add("active");
    if (backdrop) backdrop.classList.add("active");
    renderCart();
  }
}

function addToCart(id, name, price, shopName, showAlert = true) {
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, shopName, qty: 1 });
  }
  updateCartBadge();
  if (showAlert) alert(`Added "${name}" to your cart!`);
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCartBadge();
  renderCart();
}

function updateCartBadge() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge1 = document.getElementById("cart-count");
  const badge2 = document.getElementById("bottom-cart-count");
  const badge3 = document.getElementById("drawer-cart-count");
  if (badge1) badge1.textContent = totalItems;
  if (badge2) badge2.textContent = totalItems;
  if (badge3) badge3.textContent = totalItems;
}

function renderCart() {
  const listEl = document.getElementById("cart-items-list");
  const subtotalEl = document.getElementById("cart-subtotal-amount");
  const totalEl = document.getElementById("cart-total-amount");
  const checkoutBtn = document.getElementById("btn-checkout");
  if (!listEl) return;

  if (cart.length === 0) {
    listEl.innerHTML = '<p class="cart-empty-message">Your cart is empty. Add items from a neighbourhood shop to start an order.</p>';
    if (subtotalEl) subtotalEl.textContent = "₹0";
    if (totalEl) totalEl.textContent = "₹0";
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  listEl.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.qty;
    const row = document.createElement("div");
    row.className = "cart-item-row";
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <p class="text-muted" style="font-size: 11px;">${item.shopName} · Qty: ${item.qty}</p>
        <span style="font-size: 13px; font-weight: 700; color: var(--brand-primary);">₹${item.price * item.qty}</span>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">&times;</button>
    `;
    listEl.appendChild(row);
  });

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  const total = subtotal + 30;
  if (totalEl) totalEl.textContent = `₹${total}`;
  if (checkoutBtn) checkoutBtn.disabled = false;
}

// Checkout Modal
function openCheckoutModal() {
  if (cart.length === 0) return;
  const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const total = subtotal + 30;

  document.getElementById("checkout-final-amount").textContent = `₹${total}`;
  toggleCartDrawer(); // Close drawer
  const modal = document.getElementById("checkout-modal");
  if (modal) modal.classList.add("active");
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  if (modal) modal.classList.remove("active");
}

async function handlePlaceOrder(e) {
  e.preventDefault();
  const name = document.getElementById("order-cust-name").value.trim();
  const phone = document.getElementById("order-cust-phone").value.trim();
  const address = document.getElementById("order-cust-address").value.trim();
  const method = document.querySelector("input[name='order_payment_method']:checked")?.value || "upi";

  const btn = document.getElementById("btn-submit-order");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Processing Order...";
  }

  const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const total = subtotal + 30;
  const orderId = "ORD" + Math.floor(1000 + Math.random() * 9000);

  setTimeout(() => {
    alert(`🎉 Order #${orderId} Placed Successfully!

Total: ₹${total}
Delivery To: ${address}

The shop merchant has received your direct order and will begin preparing it!`);
    cart = [];
    updateCartBadge();
    closeCheckoutModal();
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Confirm & Place Order →";
    }
  }, 1000);
}
