// Initialize cart
if (!window.cart) {
    window.cart = JSON.parse(localStorage.getItem("cart")) || [];
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    renderCart();
  
    const cartModal = document.getElementById("cart-modal");
    const cartOverlay = document.getElementById("cart-overlay");
    const clearCartBtn = document.getElementById("clear-cart");
    const cartIcons = document.querySelectorAll(".cart-icon");
    const closeCartBtn = document.getElementById("close-cart");
  
    // Show cart modal
    cartIcons.forEach((icon) => {
      icon.addEventListener("click", () => {
        if (cartModal && cartOverlay) {
          cartModal.classList.remove("hidden");
          cartOverlay.classList.remove("hidden");
        }
      });
    });
  
    // Close cart modal
    if (closeCartBtn) {
      closeCartBtn.addEventListener("click", () => {
        if (cartModal && cartOverlay) {
          cartModal.classList.add("hidden");
          cartOverlay.classList.add("hidden");
        }
      });
    }
  
    // Clear cart
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", () => {
        window.cart = [];
        localStorage.setItem("cart", JSON.stringify(window.cart));
        renderCart();
      });
    }
  
    // Close modal when clicking outside
    document.addEventListener("click", (e) => {
      if (
        cartModal &&
        cartOverlay &&
        !cartModal.contains(e.target) &&
        !e.target.closest(".cart-icon") &&
        !e.target.closest("#close-cart") &&
        !e.target.closest(".bg-gray-200")
      ) {
        cartModal.classList.add("hidden");
        cartOverlay.classList.add("hidden");
      }
    });
  });
  
  function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartCounts = document.querySelectorAll(".cart-count");
    const cartTotal = document.getElementById("cart-total");
    const modalCartCount = document.getElementById("modal-cart-count");
    const checkoutBtn = document.getElementById("checkout-btn");
    const tooltip = document.getElementById("tooltip");
  
    const cart = window.cart || [];
  
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let quantityCount = cart.length;
  
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="text-sm text-gray-500 text-center py-10">Your cart is empty.</p>`;
    }
  
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
  
      const div = document.createElement("div");
      div.className = "flex items-center justify-between gap-1 pb-2 pt-1 border-b";
  
      div.innerHTML = `
        <div class="flex items-start gap-2 w-full">
          <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover" />
          <div class="flex-1 flex flex-col justify-between gap-2">
            <div>
              <h4 class="text-sm font-bold leading-snug">${item.name}</h4>
              <p class="text-sm text-gray-500">$${item.price}</p>
            </div>
            <div class="flex items-center gap-2 bg-gray-200 w-fit px-2 rounded text-sm">
              <button class="text-base px-1" onclick="updateQuantity(${index}, -1)">−</button>
              <span class="w-4 text-center">${item.quantity}</span>
              <button class="text-base px-1" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
          </div>
        </div>
      `;
  
      cartItemsContainer.appendChild(div);
    });
  
    cartCounts.forEach((el) => (el.textContent = quantityCount));
    if (modalCartCount) modalCartCount.textContent = quantityCount;
    cartTotal.textContent = `$${total.toLocaleString()}`;
    localStorage.setItem("cart", JSON.stringify(cart));
  
    // Checkout tooltip logic
    if (checkoutBtn) {
      if (cart.length === 0) {
        checkoutBtn.href = "#";
        checkoutBtn.classList.add("opacity-50", "cursor-not-allowed");
        checkoutBtn.addEventListener("mouseenter", () => tooltip?.classList.remove("hidden"));
        checkoutBtn.addEventListener("mouseleave", () => tooltip?.classList.add("hidden"));
        checkoutBtn.addEventListener("click", (e) => e.preventDefault());
      } else {
        checkoutBtn.href = "checkout.html";
        checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed");
        tooltip?.classList.add("hidden");
      }
    }
  }
  
  function updateQuantity(index, delta) {
    if (!window.cart[index]) return;
    window.cart[index].quantity += delta;
    if (window.cart[index].quantity <= 0) {
      window.cart.splice(index, 1);
    }
    renderCart();
  }
  
  function addToCart(slug, name, price, image, quantity = 1) {
    if (!window.cart) {
      window.cart = [];
    }
  
    const existing = window.cart.find((item) => item.slug === slug);
    if (existing) {
      existing.quantity += quantity;
    } else {
      window.cart.push({ slug, name, price, image, quantity });
    }
  
    localStorage.setItem("cart", JSON.stringify(window.cart));
    renderCart();
  }
  
  // Expose globally
  window.updateQuantity = updateQuantity;
  window.addToCart = addToCart;
  