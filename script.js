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
    <button onclick



