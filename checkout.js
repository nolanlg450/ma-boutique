let cart = JSON.parse(localStorage.getItem("cart")) || [];
let subtotal = cart.reduce((acc,item)=>acc+item.price*item.qty,0);
let tax = subtotal*0.02;
let total = subtotal + tax;

const cartItemsEl = document.getElementById("checkout-cart-items");
const subtotalEl = document.getElementById("checkout-subtotal");
const taxEl = document.getElementById("checkout-tax");
const totalEl = document.getElementById("checkout-total");

// Affichage panier
function renderCart(){
  cartItemsEl.innerHTML="";
  cart.forEach((item,index)=>{
    const div = document.createElement("div");
    div.innerHTML = `${item.name} x ${item.qty} = ${(item.price*item.qty).toFixed(2)} € <button onclick="removeFromCart(${index})">×</button>`;
    cartItemsEl.appendChild(div);
  });
  subtotalEl.textContent = subtotal.toFixed(2)+" €";
  taxEl.textContent = tax.toFixed(2)+" €";
  totalEl.textContent = total.toFixed(2)+" €";
  renderPayPal(total);
}
function removeFromCart(index){
  cart.splice(index,1);
  subtotal = cart.reduce((acc,item)=>acc+item.price*item.qty,0);
  tax = subtotal*0.02;
  total = subtotal+tax;
  localStorage.setItem("cart",JSON.stringify(cart));
  renderCart();
}
renderCart();

// PayPal
function renderPayPal(total){
  const container = document.getElementById("paypal-button-container");
  container.innerHTML="";
  if(cart.length===0) return;
  paypal.Buttons({
    createOrder:function(data,actions){
      return actions.order.create({purchase_units:[{amount:{value:total.toFixed(2)}}]});
    },
    onApprove:function(data,actions){
      return actions.order.capture().then(details=>{
        alert(`Merci ${details.payer.name.given_name}, votre commande est validée !`);
        localStorage.removeItem("cart");
        window.location.href="index.html";
      });
    }
  }).render('#paypal-button-container');
}

