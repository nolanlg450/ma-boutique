document.addEventListener("DOMContentLoaded", () => {
  const PRODUCTS = [
    { id: "ap4", name: "AirPods 4", price: 50.00, image: "images/airpods4.jpg", desc: "Écouteurs sans fil nouvelle génération." },
    { id: "appro2", name: "AirPods Pro 2", price: 55.00, image: "images/airpodspro2.jpg", desc: "Réduction de bruit active, qualité studio." }
  ];

  const productGrid = document.getElementById("product-grid");
  const cartPanel = document.getElementById("cart-panel");
  const openCartBtn = document.getElementById("open-cart");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsEl = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");
  const cartCountEl = document.getElementById("cart-count");
  const checkoutBtn = document.getElementById("checkout-btn");
  const toast = document.getElementById("toast");

  let cart = JSON.parse(localStorage.getItem("ns_cart") || "[]");

  // Render produits
  function renderProducts() {
    productGrid.innerHTML = "";
    PRODUCTS.forEach(p => {
      productGrid.innerHTML += `
        <div class="product-card">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="price">${p.price.toFixed(2)} €</div>
          <button class="btn add-to-cart" data-id="${p.id}">Ajouter au panier</button>
        </div>
      `;
    });
  }

  // Sauvegarde
  function saveCart(){ localStorage.setItem("ns_cart", JSON.stringify(cart)); }

  // Ajouter au panier
  function addToCart(id) {
    const prod = PRODUCTS.find(p => p.id === id);
    if (!prod) return;
    const item = cart.find(c => c.id === id);
    if (item) item.qty++;
    else cart.push({ ...prod, qty: 1 });
    saveCart();
    updateCartUI();
    showToast(`${prod.name} ajouté au panier`);
  }

  // Supprimer du panier
  function removeFromCart(i) {
    cart.splice(i, 1);
    saveCart();
    updateCartUI();
  }

  // Update panier
  function updateCartUI() {
    cartItemsEl.innerHTML = "";
    let subtotal = 0;
    cart.forEach((c,i) => {
      subtotal += c.price * c.qty;
      cartItemsEl.innerHTML += `
        <li>
          <span>${c.name} × ${c.qty}</span>
          <span>${(c.price*c.qty).toFixed(2)} € <button class="remove-item" data-i="${i}">✕</button></span>
        </li>`;
    });
    const tax = Math.round(subtotal*0.02*100)/100;
    subtotalEl.textContent = subtotal.toFixed(2)+" €";
    taxEl.textContent = tax.toFixed(2)+" €";
    totalEl.textContent = (subtotal+tax).toFixed(2)+" €";
    cartCountEl.textContent = cart.reduce((a,b)=>a+b.qty,0);
  }

  // Toast
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove("hidden");
    toast.style.opacity = "1";
    setTimeout(()=> {
      toast.style.opacity="0";
      setTimeout(()=> toast.classList.add("hidden"),300);
    },1500);
  }

  // Events
  productGrid.addEventListener("click", e=>{
    const btn = e.target.closest(".add-to-cart");
    if(btn) addToCart(btn.dataset.id);
  });
  cartItemsEl.addEventListener("click", e=>{
    const btn = e.target.closest(".remove-item");
    if(btn) removeFromCart(btn.dataset.i);
  });
  openCartBtn.addEventListener("click", ()=> cartPanel.classList.toggle("hidden"));
  closeCartBtn.addEventListener("click", ()=> cartPanel.classList.add("hidden"));
  checkoutBtn.addEventListener("click", ()=> alert("Page checkout à venir !"));

  // Init
  renderProducts();
  updateCartUI();
});
