function renderPayPalButton(totalCents) {
    const container = document.getElementById("paypal-button-container");
    container.innerHTML = ""; // Vide le conteneur avant de redessiner

    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal'
        },
        createOrder: function(data, actions) {
            if (totalCents === 0) {
                alert("Votre panier est vide !");
                return;
            }
            const totalEuros = (totalCents / 100).toFixed(2);
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
