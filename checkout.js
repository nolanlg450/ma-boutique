const cart = JSON.parse(localStorage.getItem("cart")) || [];
const orderSummary = document.getElementById("order-summary");

function displayOrder(){
  let subtotal = 0;
  cart.forEach(i=>{
    subtotal += i.price*i.qty;
    const p = document.createElement("p");
    p.textContent = `${i.name} x ${i.qty} - ${i.price*i.qty} €`;
    orderSummary.appendChild(p);
  });
  const tax = Math.round(subtotal*0.02*100)/100;
  const total = subtotal + tax;
  const summary = document.createElement("p");
  summary.innerHTML = `<strong>Sous-total: ${subtotal} € | TVA (2%): ${tax} € | Total: ${total} €</strong>`;
  orderSummary.appendChild(summary);
}

displayOrder();

// PayPal button
paypal.Buttons({
  createOrder: function(data, actions){
    const subtotal = cart.reduce((acc,i)=>acc+i.price*i.qty,0);
    const tax = Math.round(subtotal*0.02*100)/100;
    const total = subtotal + tax;
    return actions.order.create({
      purchase_units: [{
        amount: { value: total.toFixed(2) }
      }]
    });
  },
  onApprove: function(data, actions){
    return actions.order.capture().then(function(details){
      alert(`Merci ${details.payer.name.given_name}, votre paiement de ${details.purchase_units[0].amount.value} € est confirmé !`);
      localStorage.removeItem("cart");
      window.location.href="index.html";
    });
  }
}).render('#paypal-button-container');
