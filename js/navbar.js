const button = document.getElementById("menuButton");
const menu = document.getElementById("mobileMenu");

button.addEventListener("click", () => {

if(menu.style.display === "flex"){
menu.style.display = "none";
}
else{
menu.style.display = "flex";
}

});