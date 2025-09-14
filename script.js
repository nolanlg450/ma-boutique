/* NovaShop — Frontend (static) 
   - Remplace TON_CLIENT_ID dans index.html par ton PayPal client id.
   - Met les images dans /images/airpods4.jpg et /images/airpodspro2.jpg
*/

/* --- Data --- */
const PRODUCTS = [
  { id: "ap4", title: "AirPods 4", price: 50.00, image: "images/airpods4.jpg", desc: "Son clair et précis." },
  { id: "appro2", title: "AirPods Pro 2", price: 55.00, image: "images/airpodspro2.jpg", desc: "Réduction de bruit supérieure." }
];

/* --- State --- */
let cart = []; // array of {id, qty}
let user = null;

/* --- Utils --- */
function €(num){ return Number(num).toFixed(2) + " €"; }

/* --- Render products --- */
function renderProducts(){
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  PRODUCTS.forEach(p=>{
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-media">
        <img src="${p.image}" alt="${p.title}" onclick="zoomImage('${p.image}')">
      </div>
      <h3>${p.title}</h3>
      <p class="muted small">${p.desc}</p>
      <div class="price">${€(p.price)}</div>
      <div>
        <button class="btn" onclick="addToCart('${p.id}')">Ajouter</button>
        <button class="btn ghost" onclick="quickView('${p.id}')">Voir</button>
      </div>
    `;
    list.appendChild(card);
  });
}

/* --- Cart operations --- */
function findProduct(id){ return PRODUCTS.find(p=>p.id===id); }

function addToCart(id){
  const prod = findProduct(id);
  if(!prod) return;
  const entry = cart.find(c=>c.id===id);
  if(entry){ entry.qty += 1; } else { cart.push({id, qty:1}); }
  updateCartUI();
  openCart();
}

function removeFromCart(index){
  cart.splice(index,1);
  updateCartUI();
}

function updateCartUI(){
  // update count
  const totalItems = cart.reduce((s,c)=>s+c.qty,0);
  document.getElementById("cart-count").textContent = totalItems;

  // render items
  const el = document.getElementById("cart-items");
  el.innerHTML = "";
  let subtotal = 0;
  cart.forEach((c,i)=>{
    const p = findProduct(c.id);
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `<div>${p.title} <span style="color:#666">x${c.qty}</span></div>
                     <div>${€(p.price * c.qty)} <button onclick="removeFromCart(${i})" style="margin-left:8px">Suppr</button></div>`;
    el.appendChild(row);
    subtotal += p.price * c.qty;
  });

  const tax = subtotal * 0.20;
  const total = subtotal + tax;
  document.getElementById("subtotal").textContent = €(subtotal);
  document.getElementById("tax").textContent = €(tax);
  document.getElementById("total").textContent = €(total);

  // render paypal button
  renderPayPalButton(total);
}

/* --- Cart panel controls --- */
function openCart(){ document.getElementById("cart-panel").classList.remove("hidden"); }
function closeCart(){ document.getElementById("cart-panel").classList.add("hidden"); }

/* --- Quick view & zoom --- */
function quickView(id){
  const p = findProduct(id);
  if(!p) return;
  zoomImage(p.image, `${p.title}<br><small>${p.desc}</small><br><strong>${€(p.price)}</strong>`);
}

function zoomImage(src, htmlText){
  const overlay = document.createElement("div");
  overlay.style.position="fixed"; overlay.style.inset=0; overlay.style.display="flex"; overlay.style.alignItems="center"; overlay.style.justifyContent="center";
  overlay.style.background="rgba(2,6,23,0.8)"; overlay.style.zIndex=9999;
  overlay.innerHTML = `<div style="max-width:90%;max-height:90%;text-align:center;color:#fff">
                        <img src="${src}" style="max-width:70vw;max-height:70vh;border-radius:12px;display:block;margin:0 auto 12px"/>
                        <div>${htmlText || ""}</div>
                        <button style="margin-top:10px;padding:8px 12px;border-radius:8px;border:0;background:#fff;color:#111;cursor:pointer">Fermer</button>
                       </div>`;
  overlay.querySelector("button").onclick = ()=>overlay.remove();
  overlay.onclick = (e)=>{ if(e.target===overlay) overlay.remove(); }
  document.body.appendChild(overlay);
}

/* --- PayPal integration (client-side create order) --- */
function renderPayPalButton(total){
  const container = document.getElementById("paypal-button-container");
  container.innerHTML = "";
  if(!total || total <= 0) return;

  // Re-render PayPal buttons (safe to call multiple times)
  paypal.Buttons({
    style:{layout:'vertical',color:'gold',shape:'rect',label:'paypal'},
    createOrder: function(data, actions){
      return actions.order.create({
        purchase_units: [{
          amount: { value: (total).toFixed(2) }
        }]
      });
    },
    onApprove: function(data, actions){
      return actions.order.capture().then(function(details){
        alert("Paiement réussi — merci " + (details.payer.name?.given_name || "client") + " !");
        cart = [];
        updateCartUI();
      });
    },
    onError: function(err){ console.error("PayPal error", err); alert("Erreur PayPal"); }
  }).render('#paypal-button-container');
}

/* --- Auth simulation (client-side) --- */
function showLogin(){ document.getElementById("auth-modal").classList.remove("hidden"); document.getElementById("login-form").classList.remove("hidden"); document.getElementById("register-form").classList.add("hidden"); }
function showRegister(){ document.getElementById("auth-modal").classList.remove("hidden"); document.getElementById("login-form").classList.add("hidden"); document.getElementById("register-form").classList.remove("hidden"); }
function closeModal(){ document.getElementById("auth-modal").classList.add("hidden"); }
function toggleAuth(){ document.getElementById("login-form").classList.toggle("hidden"); document.getElementById("register-form").classList.toggle("hidden"); }

function register(){
  const name = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-password").value;
  if(!email || !pass){ alert("Remplis email et mot de passe"); return; }
  // simulated: store in localStorage
  const users = JSON.parse(localStorage.getItem("ns_users")||"[]");
  if(users.find(u=>u.email===email)){ alert("Compte déjà existant"); return; }
  users.push({name,email,pass});
  localStorage.setItem("ns_users", JSON.stringify(users));
  alert("Compte créé — connecte-toi"); showLogin();
}

function login(){
  const email = document.getElementById("login-username").value.trim();
  const pass = document.getElementById("login-password").value;
  const users = JSON.parse(localStorage.getItem("ns_users")||"[]");
  const u = users.find(x=>x.email===email && x.pass===pass);
  if(!u){ alert("Identifiants incorrects"); return; }
  user = u;
  alert("Connecté en tant que " + (u.name || u.email));
  closeModal();
}

/* --- Init --- */
function scrollToProducts(){ document.getElementById("products").scrollIntoView({behavior:"smooth"}); }
(function init(){
  renderProducts();
  updateCartUI();
})();


