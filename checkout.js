/* ======================= Données panier ======================= */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ======================= Sélection éléments ======================= */
const cartItemsEl = document.getElementById("checkout-cart-items");
const subtotalEl = document.getElementById("checkout-subtotal");
const taxEl = document.getElementById("checkout-tax");
const totalEl = document.getElementById("checkout-total");

/* ======================= Render panier ======================= */
function renderCart() {
  cartItemsEl.innerHTML = "";
  let subtotal = 0;
  cart.forEach(item => {
    const div = document.createElement("div");
    div.textContent = `${item.name} x ${item.qty} = ${(item.price*item.qty).toFixed(2)} €`;
    cartItemsEl.appendChild(div);
    subtotal += item.price * item.qty;
  });
  const tax = subtotal*0.02;
  const total = subtotal + tax;

  subtotalEl.textContent = subtotal.toFixed(2)+" €";
  taxEl.textContent = tax.toFixed(2)+" €";
  totalEl.textContent = total.toFixed(2)+" €";

  renderPayPal(total);
}
renderCart();

/* ======================= PayPal ======================= */
function renderPayPal(total){
  paypal.Buttons({
    createOrder: function(data, actions){
      return actions.order.create({
        purchase_units:[{amount:{value:total.toFixed(2)}}]
      });
    },
    onApprove: function(data, actions){
      return actions.order.capture().then(details=>{
        alert(`Merci ${details.payer.name.given_name}, votre commande est validée !`);
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        window.location.href = "index.html";
      });
    }
  }).render('#paypal-button-container');
}

/* ======================= Form validation ======================= */
const form = document.getElementById("checkout-form");
form.addEventListener("submit", e=>{
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const zip = document.getElementById("zip").value.trim();
  const country = document.getElementById("country").value.trim();

  if(!name || !email || !address || !city || !zip || !country){
    alert("Veuillez remplir tous les champs !");
    return;
  }

  // Si tout est rempli, PayPal devient actif (déjà rendu via renderPayPal)
  alert("Vous pouvez maintenant payer avec PayPal ci-dessous.");
});

