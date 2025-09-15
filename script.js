const products=[
  {id:1,name:"AirPods 4",price:50,image:"images/airpods4.jpg"},
  {id:2,name:"AirPods Pro 2",price:55,image:"images/airpodspro2.jpg"}
];

const productList=document.getElementById("product-list");
const cartPanel=document.getElementById("cart-panel");
const cartItemsEl=document.getElementById("cart-items");
const cartCount=document.getElementById("cart-count");
const subtotalEl=document.getElementById("subtotal");
const taxEl=document.getElementById("tax");
const totalEl=document.getElementById("total");

let cart=[];

function renderProducts(){
  products.forEach(p=>{
    const card=document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML=`
      <img src="${p.image}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>${p.price} €</p>
      <button onclick="addToCart(${p.id})">Ajouter au panier</button>
    `;
    productList.appendChild(card);
  });
}

function addToCart(id){
  const product=products.find(p=>p.id===id);
  const exist=cart.find(p=>p.id===id);
  if(exist) exist.qty++;
  else cart.push({...product,qty:1});
  updateCart();
  cartPanel.classList.add("visible");
}

function removeFromCart(index){
  cart.splice(index,1);
  updateCart();
}

function updateCart(){
  cartItemsEl.innerHTML="";
  let subtotal=0;
  cart.forEach((item,index)=>{
    const div=document.createElement("div");
    div.innerHTML=`${item.name} x ${item.qty} = ${(item.price*item.qty).toFixed(2)} € <button class="remove-btn" onclick="removeFromCart(${index})">×</button>`;
    cartItemsEl.appendChild(div);
    subtotal+=item.price*item.qty;
  });
  const tax=subtotal*0.02;
  const total=subtotal+tax;
  subtotalEl.textContent=subtotal.toFixed(2)+" €";
  taxEl.textContent=tax.toFixed(2)+" €";
  totalEl.textContent=total.toFixed(2)+" €";
  cartCount.textContent=cart.reduce((a,b)=>a+b.qty,0);
}

function renderPayPal(total){
  document.getElementById("paypal-button-container").innerHTML="";
  paypal.Buttons({
    createOrder: function(data, actions){
      return actions.order.create({
        purchase_units:[{amount:{value:total.toFixed(2)}}]
      });
    },
    onApprove: function(data, actions){
      return actions.order.capture().then(function(details){
        alert('Transaction complétée par '+details.payer.name.given_name);
        cart=[];
        updateCart();
        cartPanel.classList.remove("visible");
      });
    }
  }).render('#paypal-button-container');
}

document.getElementById("cart-btn").onclick=()=>cartPanel.classList.add("visible");
document.getElementById("close-cart").onclick=()=>cartPanel.classList.remove("visible");

// Checkout avec PayPal
setInterval(()=>{
  if(cart.length>0){
    const total=cart.reduce((a,b)=>a+b.price*b.qty,0)*1.02;
    renderPayPal(total);
  }
},500);

renderProducts();

