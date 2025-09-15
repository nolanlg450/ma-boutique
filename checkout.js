// Récupérer le panier depuis localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// Afficher le résumé de commande
function displayOrderSummary() {
  let summary = "";
  let subtotal = 0;

  cart.forEach(item => {
    summary += `<p>${item.name} x ${item.qty} - ${item.price} €</p>`;
    subtotal += item.price * item.qty;
  });

  let taxRate = 0.02; // TVA 2%
  let tax = Math.round(subtotal * taxRate * 100) / 100;
  let total = Math.round((subtotal + tax) * 100) / 100;

  summary += `<p><strong>Sous-total :</strong> ${subtotal} €</p>`;
  summary += `<p><strong>TVA (2%) :</strong> ${tax} €</p>`;
  summary += `<p><strong>Total :</strong> ${total} €</p>`;

  document.getElementById("order-summary").innerHTML = summary;
  return total;
}

const total = displayOrderSummary();

// Bouton PayPal
paypal.Buttons({
  createOrder: (data, actions) => {
    // Vérifier que le formulaire est rempli avant paiement
    const fullname = document.getElementById("fullname").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const zipcode = document.getElementById("zipcode").value;
    const country = document.getElementById("country").value;
    const email = document.getElementById("email").value;

    if (!fullname || !address || !city || !zipcode || !country || !email) {
      alert("Merci de remplir tous les champs avant de payer.");
      return;
    }

    return actions.order.create({
      purchase_units: [{
        amount: {
          value: total.toString()
        },
        shipping: {
          name: { full_name: fullname },
          address: {
            address_line_1: address,
            admin_area_2: city,
            postal_code: zipcode,
            country_code: "FR" // ⚡ Adapter si besoin
          }
        }
      }]
    });
  },
  onApprove: (data, actions) => {
    return actions.order.capture().then(details => {
      alert("Merci " + details.payer.name.given_name + "! Votre commande est confirmée.");
      localStorage.removeItem("cart"); // vider le panier après paiement
      window.location.href = "index.html"; // retour accueil
    });
  }
}).render('#paypal-button-container');
