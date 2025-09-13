let cart = [];

// Produits
const products = [
  { id: 1, name: "AirPods 4", price: 50, image: "images/airpods4.jpg" },
  { id: 2, name: "AirPods Pro 2", price: 55, image: "images/airpodspro2.jpg" }
];

// Affichage produits
function loadProducts() {
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${p.name}</h3>
      <img src="${p.image}" alt="${p.name}" onclick="zoomImage('${p.image}')">
      <p>${p.price} €</p>
      <button onclick="addToCart(${p.id},'${p.name}',${p.price})">Ajouter au panier</button>
    `;
    list.appendChild(div);
  });
}

// Zoom image
function zoomImage(src) {
  const modal = document.createElement("div");
  modal.style.position="fixed";
  modal.style.top="0"; modal.style.left="0"; modal.style.width="100%"; modal.style.height="100%";
  modal.style.background="rgba(0,0,0,0.8)"; modal.style.display="flex"; modal.style.justifyContent="center"; modal.style.alignItems="center";
  modal.innerHTML=`<img src="${src}" style="max-width:80%; max-height:80%; border-radius:15px;"><span style="position:absolute;top:20px;right:30px;color:white;font-size:2rem;cursor:pointer;">&times;</span>`;
  modal.querySelector("span").onclick=()=>modal.remove();
  document.body.appendChild(modal);
}

// Panier
function addToCart(id,name,price){ cart.push({id,name,price}); renderCart(); }
function removeFromCart(index){ cart.splice(index,1); renderCart(); }

function renderCart(){
  const ul=document.getElementById("cart-items"); ul.innerHTML="";
  let total=0;
  cart.forEach((item,index)=>{
    const li=document.createElement("li");
    li.innerHTML=`${item.name} - ${item.price} € <button onclick="removeFromCart(${index})">X</button>`;
    ul.appendChild(li);
    total+=item.price;
  });
  document.getElementById("cart-total").textContent=`Total : ${total} €`;
  renderPayPalButton(total);
}

// PayPal
function renderPayPalButton(total){
  const container=document.getElementById("paypal-button-container"); container.innerHTML="";
  if(total===0) return;
  paypal.Buttons({
    createOrder:(data,actions)=>actions.order.create({purchase_units:[{amount:{value:total.toFixed(2)}}]}),
    onApprove:async(data,actions)=>{
      const details=await actions.order.capture();
      alert("Paiement réussi par "+details.payer.name.given_name);
      cart=[]; renderCart();
    }
  }).render("#paypal-button-container");
}

// Auth simulé
function showLogin(){ showAuth("Connexion","Se connecter",login); }
function showRegister(){ showAuth("Créer un compte","S'inscrire",register); }
function showAuth(title,btnText,callback){
  document.getElementById("auth-title").textContent=title;
  document.getElementById("auth-submit").textContent=btnText;
  document.getElementById("auth-submit").onclick=callback;
  document.getElementById("auth-modal").style.display="flex";
}
function closeModal(){ document.getElementById("auth-modal").style.display="none"; }
function login(){ const username=document.getElementById("auth-username").value; alert("Connexion simulée pour : "+username); closeModal(); }
function register(){ const username=document.getElementById("auth-username").value; alert("Inscription simulée pour : "+username); closeModal(); }

// Initialisation
loadProducts();
renderCart();


