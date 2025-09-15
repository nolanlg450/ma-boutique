document.addEventListener("DOMContentLoaded", () => {
  // ----- Panier -----
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function addToCart(name, price) {
    const item = cart.find(i => i.name === name);
    if (item) { item.qty++; }
    else { cart.push({ name, price, qty: 1 }); }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
  }

  function updateCartUI() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";
    let subtotal = 0;
    cart.forEach(i => {
      subtotal += i.price * i.qty;
      cartItems.innerHTML += `<li>${i.name} x ${i.qty} - ${i.price * i.qty}€</li>`;
    });
    let tax = Math.round(subtotal * 0.02 * 100) / 100;
    document.getElementById("subtotal").textContent = subtotal + " €";
    document.getElementById("tax").textContent = tax + " €";
    document.getElementById("total").textContent = (subtotal + tax) + " €";
    document.getElementById("cart-count").textContent = cart.reduce((a, b) => a + b.qty, 0);
  }

  // Boutons panier
  const openCartBtn = document.getElementById("open-cart");
  const closeCartBtn = document.getElementById("close-cart");
  const goCheckoutBtn = document.getElementById("go-checkout");

  if(openCartBtn) openCartBtn.addEventListener("click", () => { document.getElementById("cart").classList.toggle("hidden"); });
  if(closeCartBtn) closeCartBtn.addEventListener("click", () => { document.getElementById("cart").classList.add("hidden"); });
  if(goCheckoutBtn) goCheckoutBtn.addEventListener("click", () => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "checkout.html";
  });

  // Scroll produits
  window.scrollToProducts = function() {
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  };

  // ----- Auth Modal -----
  const authModal = document.getElementById("auth-modal");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const authClose = document.getElementById("auth-close");
  const switchToRegister = document.getElementById("switch-to-register");
  const switchToLogin = document.getElementById("switch-to-login");

  if(loginBtn) loginBtn.addEventListener("click", () => { authModal.classList.remove("hidden"); loginForm.classList.remove("hidden"); registerForm.classList.add("hidden"); });
  if(signupBtn) signupBtn.addEventListener("click", () => { authModal.classList.remove("hidden"); loginForm.classList.add("hidden"); registerForm.classList.remove("hidden"); });
  if(authClose) authClose.addEventListener("click", () => { authModal.classList.add("hidden"); });
  if(switchToRegister) switchToRegister.addEventListener("click", () => { loginForm.classList.add("hidden"); registerForm.classList.remove("hidden"); });
  if(switchToLogin) switchToLogin.addEventListener("click", () => { loginForm.classList.remove("hidden"); registerForm.classList.add("hidden"); });

  // ----- Initial UI Update -----
  updateCartUI();

  console.log("Script chargé, tous les boutons sont attachés !");
});
