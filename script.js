// Produits AirPods
const PRODUCTS = [
    {id: 1, name: "AirPods 4", price: 5000, img: "https://via.placeholder.com/220x150?text=AirPods+4"},
    {id: 2, name: "AirPods Pro 2", price: 5500, img: "https://via.placeholder.com/220x150?text=AirPods+Pro+2"}
];

let cart = [];
let loggedIn = false;

// Affichage des produits
function renderProducts() {
    const container = document.getElementById("products");
    container.innerHTML = "";
    PRODUCTS.forEach(p => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>Prix : ${(p.price/100).toFixed(2)} €</p>
            <button onclick="addToCart(${p.id})">Ajouter au panier</button>
        `;
        container.appendChild(div);
    });
}

// Ajouter au panier
function addToCart(id) {
    if (!loggedIn) {
        alert("Veuillez vous connecter pour ajouter des produits au panier.");
        return;
    }
    const product = PRODUCTS.find(p => p.id === id);
    cart.push(product);
    renderCart();
}

// Affichage du panier
function renderCart() {
    const container = document.getElementById("cart-items");
    container.innerHTML = "";
    let total = 0;
    cart.forEach(p => {
        total += p.price;
        container.innerHTML += `<p>${p.name} - ${(p.price/100).toFixed(2)} €</p>`;
    });
    document.getElementById("order-total").textContent = (total/100).toFixed(2) + " €";
    renderPayPalButton(total);
}

// Bouton PayPal
function renderPayPalButton(totalCents) {
    const container = document.getElementById("paypal-button-container");
    container.innerHTML = "";

    paypal.Buttons({
        style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal' },
        onInit: function(data, actions) {
            if (totalCents === 0) {
                actions.disable();
            }
        },
        createOrder: function(data, actions) {
            if (totalCents === 0) {
                alert("Votre panier est vide !");
                return;
            }
            return actions.order.create({
                purchase_units: [{
                    amount: { value: (totalCents/100).toFixed(2) }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert("Paiement réussi par " + details.payer.name.given_name);
                cart = [];
                renderCart();
            });
        }
    }).render('#paypal-button-container');
}

// Connexion simple
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "admin" && password === "1234") {
        loggedIn = true;
        document.getElementById("login-message").textContent = "Connecté avec succès !";
        document.getElementById("login-message").style.color = "green";
        renderProducts();
    } else {
        document.getElementById("login-message").textContent = "Nom d'utilisateur ou mot de passe incorrect.";
        document.getElementById("login-message").style.color = "red";
    }
}

// Initialisation
renderProducts();
renderPayPalButton(0);
