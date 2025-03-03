let currentIndex = 0; // Índice atual do item exibido

const links = [
    {
        identifier: "sl0",
        img: "./assets/teste.png",
        url: "#",
        title: "Limiar between water and wind"
    },
    {
        identifier: "sl1",
        img: "./assets/teste2.png",
        url: "https://circular-handbell-300.notion.site/EFI-Posts-159f7e20adf88048a33ce82895975144",
        title: "Efi Posts"
    },
    {
        identifier: "sl2",
        img: "./assets/teste3.png",
        url: "http://pinterest.com",
        title: "Tech Posts"
    },
    {
        identifier: "sl3",
        img: "./assets/teste3.png",
        url: "http://pinterest.com",
        title: "Personal Posts"
    },
    {
        identifier: "sl4",
        img: "./assets/teste3.png",
        url: "https://circular-handbell-300.notion.site/Media-159f7e20adf8806897e2da5a97a09bcd?pvs=4",
        title: "Media"
    },
    {
        identifier: "sl5",
        img: "./assets/teste3.png",
        url: "http://pinterest.com",
        title: "Portfolio"
    },
    {
        identifier: "sl6",
        img: "./assets/teste3.png",
        url: "http://pinterest.com",
        title: "Socials"
    }
];

function setSelection(direction) {
    // Atualiza o índice com base na direção
    if (direction === "right") {
        currentIndex = (currentIndex + 1) % links.length; // Avança para o próximo item
    } else if (direction === "left") {
        currentIndex = (currentIndex - 1 + links.length) % links.length; // Volta para o item anterior
    }

    // Atualiza o conteúdo da seção com base no índice atual
    updateContent();
}

function updateContent() {
    const selectedField = document.getElementById("selected-field");
    const imageField = document.getElementById("image-selected-field");
    const urlField = document.getElementById("url-selected-field")

    selectedField.textContent = links[currentIndex].title;
    imageField.src = links[currentIndex].img;
    urlField.href = links[currentIndex].url;
}

// Inicializa o primeiro item ao carregar a página
function initializePage() {
    updateContent(); // Exibe o conteúdo do primeiro item (índice 0)
}

window.onload = initializePage; // Chama a função de inicialização ao carregar a página