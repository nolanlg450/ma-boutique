let cart = [];

// Produits
const products = [
  { id: 1, name: "AirPods 4", price: 50, image: "images/airpods4.jpg" },
  { id: 2, name: "AirPods Pro 2", price: 55, image: "images/airpodspro2.jpg" }
];

// Afficher produits
function loadProducts() {
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `<h3>${p.name}</h3><img src="${p.image}" alt="${p.name}"><p>${p.price} €</p><button onclick="addToCart(${p.id},'${p.name}',${p.price})">Ajouter au panier</button>`;
    list.appendChild(div);
  });
}

// Panier
function addToCart(id,name,price){ cart.push({id,name,price}); renderCart(); }

function renderCart(){
  const ul=document.getElementById("cart-items"); ul.innerHTML="";
  let total=0;
  cart.forEach(item=>{ const li=document.createElement("li"); li.textContent=`${item.name} - ${item.price} €`; ul.appendChild(li); total+=item.price; });
  document.getElementById("cart-total").textContent=`Total : ${total} €`;
  renderPayPalButton(total);
}

// PayPal
function renderPayPalButton(total){
  const container=document.getElementById("paypal-button-container"); container.innerHTML="";
  if(total===0) return;
  paypal.Buttons({
    createOrder:(data,actions)=>actions.order.create({purchase_units:[{amount:{value:total.toFixed(2)}}]}),
    onApprove:async(data,actions)=>{ const details=await actions.order.capture(); alert("Paiement réussi par "+details.payer.name.given_name); cart=[]; renderCart(); }
  }).render("#paypal-button-container");
}

// Authentification simulée
function showLogin(){ showAuth("Connexion","Se connecter",login); }
function showRegister(){ showAuth("Créer un compte","S'inscrire",register); }
function showAuth(title,btnText,callback){ document.getElementById("auth-title").textContent=title; document.getElementById("auth-submit").textContent=btnText; document.getElementById("auth-submit").onclick=callback; document.getElementById("auth-modal").style.display="flex"; }
function closeModal(){ document.getElementById("auth-modal").style.display="none"; }

function login(){ const username=document.getElementById("auth-username").value; alert("Connexion simulée pour : "+username); closeModal(); }
function register(){ const username=document.getElementById("auth-username").value; alert("Inscription simulée pour : "+username); closeModal(); }

// Initialisation
loadProducts();
renderCart();
