// Função para alternar o menu de hambúrguer
const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.getElementById("nav-links");
const closeMenu = document.getElementById("close-menu");

mobileMenu.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  navLinks
});

// Fechar o menu quando o botão "X" for clicado
closeMenu.addEventListener("click", () => {
  navLinks.classList.remove("active");
});
