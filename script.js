document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartPanel = document.getElementById("cart-panel");
  const openCartBtn = document.getElementById("open-cart");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsEl = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");
  const cartCountEl = document.getElementById("cart-count");
  const checkoutBtn = document.getElementById("checkout-btn");

  // Ouvrir/fermer le panier
  openCartBtn.addEventListener("click", () => {
    cartPanel.classList.remove("hidden");
  });
  closeCartBtn.addEventListener("click", () => {
    cartPanel.classList.add("hidden");
  });

  // Ajouter au panier
  const addButtons = document.querySelectorAll(".add-to-cart");
  addButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      const price = parseFloat(btn.getAttribute("data-price"));
      const item = cart.find(i => i.name === name);

      if (item) {
        item.qty++;
      } else {
        cart.push({ name, price, qty: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartUI();
      alert(`${name} ajouté au panier !`);
    });
  });

  // Mise à jour du panier
  function updateCartUI() {
    cartItemsEl.innerHTML = "";
    let subtotal = 0;

    cart.forEach(i => {
      subtotal += i.price * i.qty;
      cartItemsEl.innerHTML += `<li>${i.name} × ${i.qty} — ${i.price * i.qty} €</li>`;
    });

    const tax = Math.round(subtotal * 0.02 * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    subtotalEl.textContent = subtotal.toFixed(2) + " €";
    taxEl.textContent = tax.toFixed(2) + " €";
    totalEl.textContent = total.toFixed(2) + " €";
    cartCountEl.textContent = cart.reduce((a, b) => a + b.qty, 0);
  }

  // Bouton "Passer à la caisse"
  checkoutBtn.addEventListener("click", () => {
    window.location.href = "checkout.html";
  });

  updateCartUI();
});

// Scroll vers produits
function scrollToProducts() {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}
