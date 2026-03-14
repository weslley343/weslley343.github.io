const btn = document.querySelector(".mobile-menu-btn")
const menu = document.querySelector(".mobile-menu")
const closeBtn = document.querySelector(".close-btn")

btn.addEventListener("click", () => {
    menu.classList.toggle("open")
})

closeBtn.addEventListener("click", () => {
    menu.classList.remove("open")
})