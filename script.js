/* NovaShop — frontend static
   - Place images/airpods4.jpg et images/airpodspro2.jpg dans le repo.
*/

/* Products */
const PRODUCTS = [
  { id: "ap4", title: "AirPods 4", price: 50.00, image: "images/airpods4.jpg", desc: "Son clair et précis, confort quotidien." },
  { id: "appro2", title: "AirPods Pro 2", price: 55.00, image: "images/airpodspro2.jpg", desc: "Réduction de bruit active, qualité studio." }
];

/* State */
let cart = [];
let currentUser = null;

/* Helpers */
function formatEuro(n){ return Number(n).toFixed(2) + " €"; }

/* Render products */
function renderProducts(){
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  PRODUCTS.forEach(p=>{
    const el = document.createElement("div");
    el.className = "product-card";
    el.innerHTML = `
      <div class="product-media"><img src="${p.image}" alt="${p.title}" onclick="zoomImage('${p.image}')"></div>
      <h3>${p.title}</h3>
      <p class="muted small">${p.desc}</p>
      <div class="price">${formatEuro(p.price)}</div>
      <div style="display:flex;justify-content:center;gap:8px;margin-top:8px">
        <button class="btn" onclick="addToCart('${p.id}')">Ajouter</button>
        <button class="btn ghost" onclick="quickView('${p.id}')">Voir</button>
      </div>
    `;
    list.appendChild(el);
  });
}

/* Cart logic */
function findProduct(id){ return PRODUCTS.find(p=>p.id===id); }

function addToCart(id){
  if(!currentUser){
    alert("Tu dois être connecté pour ajouter au panier.");
    showLogin();
    return;
  }
  const entry = cart.find(c=>c.id===id);
  if(entry) entry.qty++;
  else cart.push({ id, qty: 1 });
  saveCart();
  updateCartUI();
  openCart();
}

function removeFromCart(index){
  cart.splice(index,1);
  saveCart();
  updateCartUI();
}

function saveCart(){
  if(currentUser){
    localStorage.setItem(`ns_cart_${currentUser.email}`, JSON.stringify(cart));
  } else {
    localStorage.setItem("ns_cart_guest", JSON.stringify(cart));
  }
}

function loadCartForUser(){
  if(currentUser){
    cart = JSON.parse(localStorage.getItem(`ns_cart_${currentUser.email}`) || "[]");
  } else {
    cart = JSON.parse(localStorage.getItem("ns_cart_guest") || "[]");
  }
}

/* Render cart UI */
function updateCartUI(){
  const count = cart.reduce((s,c)=>s + c.qty, 0);
  document.getElementById("cart-count").textContent = count;

  const itemsEl = document.getElementById("cart-items");
  itemsEl.innerHTML = "";
  let subtotal = 0;
  cart.forEach((c, i) => {
    const p = findProduct(c.id);
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `<div>${p.title} <span class="muted">x${c.qty}</span></div>
                     <div>${formatEuro(p.price * c.qty)} <button onclick="removeFromCart(${i})">Suppr</button></div>`;
    itemsEl.appendChild(row);
    subtotal += p.price * c.qty;
  });

  const taxRate = 0.02; // 2%
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  document.getElementById("subtotal").textContent = formatEuro(subtotal);
  document.getElementById("tax").textContent = formatEuro(tax);
  document.getElementById("total").textContent = formatEuro(total);

  renderPayPalButton(total);
}

/* Cart panel controls */
function toggleCart(){ document.getElementById("cart-panel").classList.toggle("hidden"); }
function openCart(){ document.getElementById("cart-panel").classList.remove("hidden"); }
function closeCart(){ document.getElementById("cart-panel").classList.add("hidden"); }

/* Quick view & zoom */
function quickView(id){
  const p = findProduct(id);
  zoomImage(p.image, `<strong>${p.title}</strong><br><span class="muted">${p.desc}</span><br><strong>${formatEuro(p.price)}</strong>`);
}

function zoomImage(src, htmlText = ""){
  const overlay = document.createElement("div");
  overlay.style.position="fixed"; overlay.style.inset=0; overlay.style.display="flex"; overlay.style.alignItems="center"; overlay.style.justifyContent="center";
  overlay.style.background="rgba(2,6,23,0.8)"; overlay.style.zIndex=9999;
  overlay.innerHTML = `<div style="max-width:92%;max-height:92%;text-align:center;color:#fff">
                        <img src="${src}" style="max-width:70vw;max-height:70vh;border-radius:12px;display:block;margin:0 auto 12px"/>
                        <div>${htmlText}</div>
                        <button style="margin-top:12px;padding:8px 12px;border-radius:8px;border:0;background:#fff;color:#111;cursor:pointer">Fermer</button>
                       </div>`;
  overlay.querySelector("button").onclick = ()=>overlay.remove();
  overlay.onclick = (e)=>{ if(e.target === overlay) overlay.remove(); }
  document.body.appendChild(overlay);
}

/* Auth (client-side) */
function showLogin(){
  document.getElementById("auth-modal").classList.remove("hidden");
  document.getElementById("login-form").classList.remove("hidden");
  document.getElementById("register-form").classList.add("hidden");
  document.getElementById("auth-modal").ariaHidden = "false";
}
function showRegister(){
  document.getElementById("auth-modal").classList.remove("hidden");
  document.getElementById("register-form").classList.remove("hidden");
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("auth-modal").ariaHidden = "false";
}
function closeModal(){
  document.getElementById("auth-modal").classList.add("hidden");
  document.getElementById("auth-modal").ariaHidden = "true";
}

/* DOM events binding */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("auth-close").addEventListener("click", closeModal);
  document.getElementById("to-register").addEventListener("click", (e) => { e.preventDefault(); showRegister(); });
  document.getElementById("to-login").addEventListener("click", (e) => { e.preventDefault(); showLogin(); });

  document.getElementById("register-btn").addEventListener("click", register);
  document.getElementById("login-btn").addEventListener("click", login);

  document.getElementById("open-cart").addEventListener("click", toggleCart);
  document.getElementById("close-cart").addEventListener("click", toggleCart);

  loadUserFromStorage();
  loadCartForUser();
  renderProducts();
  updateCartUI();
});

/* Register */
function register(){
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim().toLowerCase();
  const pass = document.getElementById("reg-password").value;
  const msg = document.getElementById("reg-msg");

  if(!name || !email || pass.length < 4){ msg.textContent = "Remplis tous les champs (mot de passe ≥4)."; msg.style.color="red"; return; }

  const users = JSON.parse(localStorage.getItem("ns_users") || "[]");
  if(users.find(u => u.email === email)){ msg.textContent = "Un compte existe déjà pour cet email."; msg.style.color="red"; return; }

  users.push({ name, email, pass });
  localStorage.setItem("ns_users", JSON.stringify(users));
  msg.textContent = "Compte créé — connecte-toi."; msg.style.color="green";
  setTimeout(()=>{ showLogin(); msg.textContent = ""; }, 900);
}

/* Login */
function login(){
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const pass = document.getElementById("login-password").value;
  const msg = document.getElementById("login-msg");
  const users = JSON.parse(localStorage.getItem("ns_users") || "[]");
  const u = users.find(x => x.email === email && x.pass === pass);
  if(!u){ msg.textContent = "Identifiants incorrects."; msg.style.color="red"; return; }

  currentUser = { name: u.name, email: u.email };
  localStorage.setItem("ns_session", JSON.stringify(currentUser));
  msg.textContent = "Connecté !"; msg.style.color="green";
  closeModal();
  loadCartForUser();
  updateCartUI();
  refreshUserArea();
}

/* Load user from storage */
function loadUserFromStorage(){
  currentUser = JSON.parse(localStorage.getItem("ns_session") || "null");
  refreshUserArea();
}

/* Update header user area */
function refreshUserArea(){
  const ua = document.getElementById("user-area");
  if(currentUser){
    ua.innerHTML = `<span style="color:white;margin-right:8px">Salut, <strong>${escapeHtml(currentUser.name)}</strong></span>
                    <button class="btn ghost" onclick="logout()">Déconnexion</button>`;
  } else {
    ua.innerHTML = `<button class="btn ghost" onclick="showLogin()">Connexion</button>
                    <button class="btn" onclick="showRegister()">Créer un compte</button>`;
  }
}

/* Logout */
function logout(){
  localStorage.removeItem("ns_session");
  currentUser = null;
  loadCartForUser();
  updateCartUI();
  refreshUserArea();
}

/* Escape HTML */
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* PayPal integration */
function renderPayPalButton(total){
  const container = document.getElementById("paypal-button-container");
  container.innerHTML = "";

  if(total <= 0) return;

  paypal.Buttons({
    style:{layout:'vertical',color:'gold',shape:'rect',label:'paypal'},
    onInit: function(data, actions){
      if(!currentUser || total <= 0) actions.disable();
    },
    createOrder: function(data, actions){
      if(!currentUser){ alert("Connecte-toi pour payer."); return; }
      if(total <= 0){ alert("Panier vide."); return; }
      return actions.order.create({
        purchase_units: [{ amount: { value: (total).toFixed(2) } }]
      });
    },
    onApprove: function(data, actions){
      return actions.order.capture().then(function(details){
        alert("Paiement accepté — merci " + (details.payer.name?.given_name || "client") + " !");
        cart = [];
        saveCart();
        updateCartUI();
      });
    },
    onError: function(err){
      console.error("PayPal error:", err);
      alert("Erreur PayPal. Vérifie la console.");
    }
  }).render('#paypal-button-container');
}


