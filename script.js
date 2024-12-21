const apiUrl = 'https://api.spaceflightnewsapi.net/v4/articles';
const articlesContainer = document.getElementById('articlesContainer');
const loadingMessage = document.getElementById('loadingMessage');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const libraryContainer = document.getElementById('libraryContainer');

let articles = [];
let offset = 0; // Zmienna do zarządzania paginacją
const limit = 10; // Liczba artykułów do załadowania na raz

// Funkcja do ładowania artykułów
async function loadArticles() {
    loadingMessage.innerText = 'Ładowanie artykułów...';
    try {
        const response = await fetch(`${apiUrl}?limit=${limit}&offset=${offset}`);
        const data = await response.json();
        articles = [...articles, ...data.results]; // Dodaj nowe artykuły do istniejących
        displayArticles(articles);
        offset += limit; // Zwiększ offset o liczbę załadowanych artykułów
    } catch (error) {
        console.error('Błąd podczas ładowania artykułów:', error);
        loadingMessage.innerText = 'Błąd podczas ładowania artykułów.';
    }
}

// Funkcja do wyświetlania artykułów
function displayArticles(articles) {
    articlesContainer.innerHTML = '';
    loadingMessage.innerText = '';
    if (articles.length === 0) {
        articlesContainer.innerHTML = '<p>Brak artykułów do wyświetlenia.</p>';
        return;
    }
    
    articles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('article');
        articleDiv.innerHTML = `
            <h2>${article.title}</h2>
            <img src="${article.image_url}" alt="${article.title}" />
            <p>${article.summary}</p>
            <p><strong>Źródło:</strong> ${article.news_site}</p>
            <p><strong>Data publikacji:</strong> ${new Date(article.published_at).toLocaleDateString()}</p>
           
            <a href="${article.url}" target="_blank">Czytaj więcej</a>
        `;
        articlesContainer.appendChild(articleDiv);
    });
}

// Funkcja do wyszukiwania artykułów
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm)
    );
    displayArticles(filteredArticles);
});


// Funkcja do sprawdzania, czy użytkownik przewinął na dół
function checkScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        loadArticles(); // Załaduj więcej artykułów
    }
}

// Ładowanie artykułów po załadowaniu strony
window.onload = () => {
    loadArticles();
    updateLibrary();
};

// Nasłuchiwanie zdarzenia scroll
window.addEventListener('scroll', checkScroll);
