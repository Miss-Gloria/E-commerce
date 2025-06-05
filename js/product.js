document.addEventListener("DOMContentLoaded", () => {
  const productSlug = new URLSearchParams(window.location.search).get("slug");
  if (!productSlug) return;

  const loader = document.getElementById("loader");
  const container = document.getElementById("product-container");

  if (!loader || !container) return;

  loader.classList.remove("hidden");
  container.classList.add("hidden");

  fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      const product = data.find((p) => p.slug === productSlug);
      if (!product) return;

      document.getElementById("product-title").textContent = product.name;
      document.getElementById("product-desc").textContent = product.description;
      document.getElementById("product-price").textContent = `$${product.price}`;
      document.getElementById("product-img").src = product.image.desktop;
      document.getElementById("product-img").alt = product.name;

      if (product.new) {
        document.getElementById("new-tag").classList.remove("hidden");
      }

      document.getElementById("features").textContent = product.features;

      const includesList = document.getElementById("box-items");
      includesList.innerHTML = "";
      product.includes.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `<span class='text-orange-500 font-bold mr-2'>${item.quantity}x</span> ${item.item}`;
        includesList.appendChild(li);
      });

      document.getElementById("gallery-img-1").src = product.gallery.first.desktop;
      document.getElementById("gallery-img-2").src = product.gallery.second.desktop;
      document.getElementById("gallery-img-3").src = product.gallery.third.desktop;

      const othersContainer = document.getElementById("others");
      othersContainer.innerHTML = "";
      product.others.forEach((other) => {
        const div = document.createElement("div");
        div.className = "text-center space-y-4";
        div.innerHTML = `
          <img src="${other.image.desktop}" alt="${other.name}" class="rounded-xl mx-auto" />
          <h3 class="uppercase font-bold text-lg">${other.name}</h3>
          <a href="product.html?slug=${other.slug}" class="inline-block bg-orange-500 hover:bg-orange-400 text-white uppercase tracking-widest py-3 px-6 text-sm">See Product</a>
        `;
        othersContainer.appendChild(div);
      });

      // ✅ Attach Add to Cart Event
      const addToCartBtn = document.getElementById("add-to-cart-btn");
      if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
          const quantity = parseInt(document.getElementById("quantity").textContent);
          addToCart(product.slug, product.name, product.price, product.image.desktop, quantity);
        });
      }

      loader.classList.add("hidden");
      container.classList.remove("hidden");
    })
    .catch((err) => {
      console.error("Error loading product:", err);
      loader.innerHTML = `<p class='text-red-500'>Failed to load product.</p>`;
    });

  // Quantity controls
  let quantity = 1;
  const quantitySpan = document.getElementById("quantity");
  const increaseBtn = document.getElementById("increase");
  const decreaseBtn = document.getElementById("decrease");

  if (increaseBtn && decreaseBtn && quantitySpan) {
    increaseBtn.addEventListener("click", () => {
      quantity++;
      quantitySpan.textContent = quantity;
    });

    decreaseBtn.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        quantitySpan.textContent = quantity;
      }
    });
  }
});
