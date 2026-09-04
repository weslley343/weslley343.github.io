const subtitleEl = document.getElementById('random-subtitle-text');
let subtitles = ["Carregando..."]; // Default before fetch

async function loadSubtitles() {
    try {
        const response = await fetch('js/phrases.json?t=' + new Date().getTime());
        if (response.ok) {
            subtitles = await response.json();
            setRandomSubtitle();
        }
    } catch (error) {
        console.error('Error loading phrases:', error);
        subtitles = ["Connection established"];
        setRandomSubtitle();
    }
}

function setRandomSubtitle() {
    if (subtitleEl && subtitles.length > 0) {
        const randomIndex = Math.floor(Math.random() * subtitles.length);
        subtitleEl.textContent = subtitles[randomIndex];
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadSubtitles();
});
