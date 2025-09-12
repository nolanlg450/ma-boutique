const PRODUCTS = [
    {id: 1, name: "Produit A", price: 1999},
    {id: 2, name: "Produit B", price: 2999},
    {id: 3, name: "Produit C", price: 3999}
];

let cart = [];

function centsToEuroString(cents) {
    return (cents / 100).toFixed(2) + " €";
}

function renderProducts() {
    const container = document.getElementById("products");
    container.innerHTML = "";
    PRODUCTS.forEach(p => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <h3>${p.name}</h3>
            <p>Prix : ${centsToEuroString(p.price)}</p>
            <button onclick="addToCart(${p.id})">Ajouter au panier</button>
        `;
        container.appendChild(div);
    });
}

function addToCart(id) {
    const product = PRODUCTS.find(p => p.id === id);
    cart.push(product);
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cart-items");
    container.innerHTML = "";
    let total = 0;
    cart.forEach((p, index) => {
        total += p.price;
        container.innerHTML += `<p>${p.name} - ${centsToEuroString(p.price)}</p>`;
    });
    document.getElementById("order-total").textContent = centsToEuroString(total);
    renderPayPalButton(total);
}

function renderPayPalButton(totalCents) {
    const totalEuros = (totalCents / 100).toFixed(2);

    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: { value: totalEuros }
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

// Initialisation
renderProducts();
