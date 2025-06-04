document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    const container = document.getElementById("product-list");
  
    // Show loader, hide product container initially
    loader.classList.remove("hidden");
    container.classList.add("hidden");
  
    // Load navbar and footer
    async function loadPartials() {
      const nav = await fetch("partials/navbar.html").then(res => res.text());
      const foot = await fetch("partials/footer.html").then(res => res.text());
      document.getElementById("navbar").innerHTML = nav;
      document.getElementById("footer").innerHTML = foot;
    }
  
    function getCategoryFromURL() {
      const params = new URLSearchParams(window.location.search);
      return params.get("category") || "headphones";
    }
  
    loadPartials().then(() => {
      const menuBtn = document.getElementById("menu-btn");
      const mobileNav = document.getElementById("mobile-nav");
  
      if (menuBtn && mobileNav) {
        menuBtn.addEventListener("click", () => {
          mobileNav.classList.toggle("hidden");
        });
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
  
            // Alternate layout
            if (index % 2 !== 0) {
              wrapper.classList.add("md:flex-row-reverse");
            }
  
            // Fade-in animation
            wrapper.classList.add("fade-in");
            wrapper.style.animationDelay = `${index * 0.1}s`;
  
            // Product content
            clone.querySelector(".img-desktop").srcset = product.categoryImage.desktop;
            clone.querySelector(".img-tablet").srcset = product.categoryImage.tablet;
            clone.querySelector(".img-mobile").src = product.categoryImage.mobile;
            clone.querySelector(".img-mobile").alt = product.name;
  
            if (product.new) {
              clone.querySelector(".new-badge").classList.remove("hidden");
            }
  
            clone.querySelector(".product-name").textContent = product.name;
            clone.querySelector(".product-desc").textContent = product.description;
  
            container.appendChild(clone);
          });
  
          loader.classList.add("hidden");
          container.classList.remove("hidden");
        })
        .catch(err => {
          console.error("Failed to load data.json:", err);
          loader.innerHTML = `<p class="text-red-500">Error loading products.</p>`;
        });
    });
  });
  