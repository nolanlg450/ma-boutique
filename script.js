// ----- Panier -----
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price){
  const item = cart.find(i=>i.name===name);
  if(item){item.qty++;}
  else{cart.push({name, price, qty:1});}
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI(){
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML="";
  let subtotal=0;
  cart.forEach(i=>{
    subtotal+=i.price*i.qty;
    cartItems.innerHTML+=`<li>${i.name} x ${i.qty} - ${i.price*i.qty}€</li>`;
  });
  let tax = Math.round(subtotal*0.02*100)/100;
  document.getElementById("subtotal").textContent=subtotal+" €";
  document.getElementById("tax").textContent=tax+" €";
  document.getElementById("total").textContent=(subtotal+tax)+" €";
  document.getElementById("cart-count").textContent=cart.reduce((a,b)=>a+b.qty,0);
}

// Boutons panier
document.getElementById("open-cart").addEventListener("click",()=>{document.getElementById("cart").classList.toggle("hidden");});
document.getElementById("close-cart").addEventListener("click",()=>{document.getElementById("cart").classList.add("hidden");});

// Redirection checkout
document.getElementById("go-checkout").addEventListener("click",()=>{
  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href="checkout.html";
});

// ----- Scroll produits -----
function scrollToProducts(){
  document.getElementById("products").scrollIntoView({behavior:"smooth"});
}

// ----- Auth Modal -----
const authModal = document.getElementById("auth-modal");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

document.getElementById("login-btn").addEventListener("click",()=>{authModal.classList.remove("hidden"); loginForm.classList.remove("hidden"); registerForm.classList.add("hidden");});
document.getElementById("signup-btn").addEventListener("click",()=>{authModal.classList.remove("hidden"); loginForm.classList.add("hidden"); registerForm.classList.remove("hidden");});
document.getElementById("auth-close").addEventListener("click",()=>{authModal.classList.add("hidden");});

// Switch forms
document.getElementById("switch-to-register").addEventListener("click",()=>{
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
});
document.getElementById("switch-to-login").addEventListener("click",()=>{
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
});

updateCartUI();
