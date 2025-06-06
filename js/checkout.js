document.addEventListener("DOMContentLoaded", function () {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const summaryItemsContainer = document.getElementById("summary-items");
    const summaryTotal = document.getElementById("summary-total");
    const summaryVAT = document.getElementById("summary-vat");
    const summaryGrand = document.getElementById("summary-grand");
    const checkoutBtn = document.getElementById("checkout-btn");
    const checkoutForm = document.querySelector("form");
    const SHIPPING_COST = 50;
  
    const emoneyFields = document.getElementById("emoney-fields");
    const codMessage = document.getElementById("cod-message");
    const emoneyNumber = document.querySelector('input[placeholder="e-Money Number"]');
    const emoneyPin = document.querySelector('input[placeholder="e-Money PIN"]');
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
  
    let total = 0;
    summaryItemsContainer.innerHTML = "";
  
    if (cartItems.length === 0) {
      summaryItemsContainer.innerHTML = "<p class='text-sm text-gray-500'>Your cart is empty.</p>";
    }
  
    cartItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
  
      const div = document.createElement("div");
      div.className = "flex items-center justify-between";
      div.innerHTML = `
        <div class="flex items-center gap-4">
          <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded" />
          <div>
            <p class="text-sm font-bold">${item.name}</p>
            <p class="text-xs text-gray-500">$${item.price.toFixed(2)} x ${item.quantity}</p>
          </div>
        </div>
        <p class="text-sm font-bold">$${itemTotal.toFixed(2)}</p>
      `;
      summaryItemsContainer.appendChild(div);
    });
  
    const vat = total * 0.2;
    const grandTotal = total + SHIPPING_COST + vat;
  
    summaryTotal.textContent = `$${total.toFixed(2)}`;
    summaryVAT.textContent = `$${vat.toFixed(2)}`;
    summaryGrand.textContent = `$${grandTotal.toFixed(2)}`;
  
    // Payment toggle logic
    paymentRadios.forEach(radio => {
      radio.addEventListener("change", () => {
        const isEmoney = radio.value === "emoney";
  
        emoneyFields.classList.toggle("hidden", !isEmoney);
        codMessage.classList.toggle("hidden", isEmoney);
      });
    });
  
    // Real-time validation styling
    const inputs = checkoutForm.querySelectorAll("input[required]");
    inputs.forEach(input => {
      input.addEventListener("input", () => {
        if (!input.checkValidity()) {
          input.classList.add("input-error");
        } else {
          input.classList.remove("input-error");
        }
      });
    });
  
    // Final form validation and modal trigger
    checkoutBtn.addEventListener("click", () => {
      const selectedPayment = document.querySelector('input[name="payment"]:checked')?.value;
      const isEmoney = selectedPayment === "emoney";
  
      emoneyNumber.required = isEmoney;
      emoneyPin.required = isEmoney;
  
      if (!isEmoney) {
        emoneyNumber.classList.remove("input-error");
        emoneyPin.classList.remove("input-error");
      }
  
      if (checkoutForm.checkValidity()) {
        const grand = summaryGrand.textContent;
        const modalTotal = document.getElementById("modal-grand-total");
        const modalItem = document.getElementById("modal-item");
        const modalOtherCount = document.getElementById("modal-other-count");
      
        document.getElementById("modal-grand-total").textContent = grand;
      
        // ✅ Load first product in modal
        const firstItem = cartItems[0];
        modalItem.innerHTML = `
          <img src="${firstItem.image}" alt="${firstItem.name}" class="w-12 h-12 rounded" />
          <div class="text-left">
            <p class="text-sm font-bold">${firstItem.name}</p>
            <p class="text-xs text-gray-500">$${firstItem.price.toFixed(2)} x ${firstItem.quantity}</p>
          </div>
        `;
      
        // ✅ Add “and X other items” if more
        const extraCount = cartItems.length - 1;
        modalOtherCount.textContent = extraCount > 0 ? `and ${extraCount} other item${extraCount > 1 ? "s" : ""}` : "";
        modalOtherCount.classList.toggle("hidden", extraCount <= 0);
      
        document.getElementById("success-modal").classList.remove("hidden");
      
        localStorage.removeItem("cart");
        checkoutForm.reset();
        emoneyFields.classList.remove("hidden");
        codMessage.classList.add("hidden");
      }
       else {
        checkoutForm.reportValidity();
        const firstInvalid = checkoutForm.querySelector(":invalid");
        firstInvalid?.focus();
      }
    });
  });
  