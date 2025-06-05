document.addEventListener("DOMContentLoaded", () => {
  // Burger menu toggle
  const menuBtn = document.getElementById("menu-btn");
  const mobileNav = document.getElementById("mobile-nav");

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      mobileNav.classList.toggle("hidden");
    });
  }

  // Update cart badge
  const cartCount = document.getElementById("cart-count");
  const modalCartCount = document.getElementById("modal-cart-count");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = totalItems;
  if (modalCartCount) modalCartCount.textContent = totalItems;

  // Product rendering logic (only on category pages)
  const loader = document.getElementById("loader");
  const container = document.getElementById("product-list");

  if (loader && container) {
    loader.classList.remove("hidden");
    container.classList.add("hidden");

    function getCategoryFromURL() {
      const params = new URLSearchParams(window.location.search);
      return params.get("category") || "headphones";
    }

    const category = getCategoryFromURL();
    const title = document.getElementById("page-title");
    if (title) {
      title.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    }

    fetch("./data.json")
      .then(res => res.json())
      .then(data => {
        const products = data.filter(p => p.category === category);
        const template = document.getElementById("product-template");

        products.forEach((product, index) => {
          const clone = template.content.cloneNode(true);
          const wrapper = clone.querySelector("div.flex");

          if (index % 2 !== 0) wrapper.classList.add("md:flex-row-reverse");
          wrapper.classList.add("fade-in");
          wrapper.style.animationDelay = `${index * 0.1}s`;

          clone.querySelector(".img-desktop").srcset = product.categoryImage.desktop;
          clone.querySelector(".img-tablet").srcset = product.categoryImage.tablet;
          clone.querySelector(".img-mobile").src = product.categoryImage.mobile;
          clone.querySelector(".img-mobile").alt = product.name;

          if (product.new) {
            clone.querySelector(".new-badge").classList.remove("hidden");
          }

          clone.querySelector(".product-name").textContent = product.name;
          clone.querySelector(".product-desc").textContent = product.description;
          clone.querySelector("a").href = `product.html?slug=${product.slug}`;
          container.appendChild(clone);
        });

        loader.classList.add("hidden");
        container.classList.remove("hidden");
      })
      .catch(err => {
        console.error("Failed to load data.json:", err);
        loader.innerHTML = `<p class="text-red-500">Error loading products.</p>`;
      });
  }
});
