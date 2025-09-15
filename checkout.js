document.getElementById("pay-btn").onclick=()=>{
  const name=document.getElementById("name").value;
  const address=document.getElementById("address").value;
  const city=document.getElementById("city").value;
  const zip=document.getElementById("zip").value;

  if(!name || !address || !city || !zip){
    alert("Merci de remplir tous les champs !");
    return;
  }
  alert("Commande confirmée ! Merci pour votre achat, "+name);
  window.location.href="index.html";
}


