// Produits
const products = [
  {id:1,name:"AirPods 4",price:50,image:"images/airpods4.jpg"},
  {id:2,name:"AirPods Pro 2",price:55,image:"images/airpodspro2.jpg"}
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const productListEl = document.getElementById("product-list");
const cartCountEl = document.getElementById("cart-count");

// Affichage produits
products.forEach(p=>{
  const div = document.createElement("div");
  div.className = "product-card";
  div.innerHTML = `
    <img src="${p.image}" alt="${p.name}">
    <h3>${p.name}</h3>
    <p>${p.price} €</p>
    <button onclick="addToCart(${p.id})">Ajouter au panier</button>
  `;
  productListEl.appendChild(div);
});

// Ajouter au panier
function addToCart(id){
  const product = products.find(p=>p.id===id);
  let item = cart.find(i=>i.id===id);
  if(item) item.qty++;
  else cart.push({...product, qty:1});
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`${product.name} ajouté au panier !`);
}

function updateCartCount(){
  cartCountEl.textContent = cart.reduce((a,b)=>a+b.qty,0);
}

updateCartCount();

// Checkout
document.getElementById("checkout-btn")?.addEventListener("click", ()=>{
  if(!localStorage.getItem("currentUser")){
    alert("Vous devez être connecté pour finaliser la commande.");
    window.location.href="login.html";
  }else{
    window.location.href="checkout.html";
  }
});


