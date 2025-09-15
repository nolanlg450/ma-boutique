/* ======================= Données produits ======================= */
const products = [
  { id: 1, name: "AirPods 4", price: 50, image: "images/airpods4.jpg" },
  { id: 2, name: "AirPods Pro 2", price: 55, image: "images/airpodspro2.jpg" }
];

/* ======================= Sélection des éléments ======================= */
const productList = document.getElementById("product-list");
const cartPanel = document.getElementById("cart-panel");
const cartItemsEl = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");

const cartBtn = document.getElementById("cart-btn");
const closeCartBtn = document.getElementById("close-cart");

const authBtn = document.getElementById("auth-btn");
const authModal = document.getElementById("auth-modal");
const closeAuthBtn = document.getElementById("close-auth");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const toRegister = document.getElementById("to-register");
const toLogin = document.getElementById("to-login");

let cart = [];

/* ======================= Fonctions ======================= */

/* Render produits sur la page */
function renderProducts() {
  products.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>${p.price} €</p>
      <button onclick="addToCart(${p.id})">Ajouter au panier</button>
    `;
    productList.appendChild(card);
  });
}

/* Ajouter un produit au panier */
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const exist = cart.find(p => p.id === id);
  if (exist) exist.qty++;
  else cart.push({ ...product, qty: 1 });
  updateCart();
  cartPanel.classList.add("visible");
}

/* Supprimer un produit du panier */
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

/* Mettre à jour le panier */
function updateCart() {
  cartItemsEl.innerHTML = "";
  let subtotal = 0;
  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      ${item.name} x ${item.qty} = ${(item.price * item.qty).toFixed(2)} €
      <button class="remove-btn" onclick="removeFromCart(${index})">×</button>
    `;
    cartItemsEl.appendChild(div);
    subtotal += item.price * item.qty;
  });
  const tax = subtotal * 0.02;
  const total = subtotal + tax;
  subtotalEl.textContent = subtotal.toFixed(2) + " €";
  taxEl.textContent = tax.toFixed(2) + " €";
  totalEl.textContent = total.toFixed(2) + " €";
  cartCount.textContent = cart.reduce((a, b) => a + b.qty, 0);

  // Mettre à jour PayPal
  if (cart.length > 0) renderPayPal(total);
}

/* ======================= PayPal ======================= */
function renderPayPal(total) {
  const container = document.getElementById("paypal-button-container");
  container.innerHTML = "";
  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: { value: total.toFixed(2) }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(details => {
        alert("Paiement effectué par " + details.payer.name.given_name);
        cart = [];
        updateCart();
        cartPanel.classList.remove("visible");
      });
    }
  }).render('#paypal-button-container');
}

/* ======================= Carousel Hero ======================= */
let carouselIndex = 0;
const carouselImages = document.querySelectorAll(".hero-carousel img");

function showCarousel() {
  carouselImages.forEach((img, i) => img.style.display = (i === carouselIndex ? "block" : "none"));
  carouselIndex = (carouselIndex + 1) % carouselImages.length;
}
setInterval(showCarousel, 3000); // Changement toutes les 3 sec
showCarousel();

/* ======================= Event listeners ======================= */
cartBtn.addEventListener("click", () => cartPanel.classList.add("visible"));
closeCartBtn.addEventListener("click", () => cartPanel.classList.remove("visible"));

// Modal Connexion / Inscription
authBtn.addEventListener("click", () => authModal.classList.remove("hidden"));
closeAuthBtn.addEventListener("click", () => authModal.classList.add("hidden"));
toRegister.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
});
toLogin.addEventListener("click", () => {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
});

/* ======================= Scroll to Products ======================= */
function scrollToProducts() {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

/* ======================= Initialisation ======================= */
renderProducts();
updateCart();

// Récupérer l'utilisateur connecté
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Rediriger vers login si non connecté avant checkout
document.getElementById("checkout-btn")?.addEventListener("click", ()=>{
  if(!currentUser){
    alert("Vous devez être connecté pour finaliser la commande.");
    window.location.href = "login.html";
  }else{
    window.location.href = "checkout.html";
  }
});



