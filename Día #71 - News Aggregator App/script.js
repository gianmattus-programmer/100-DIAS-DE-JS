const apiKey = "TU_API_KEY_AQUI";
const baseUrl = "https://newsapi.org/v2/";

async function fetchNews(isSearch = false) {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = '<p>Cargando noticias...</p>';

    try {
        let url;
        if (isSearch) {
            const searchKeyword = document.getElementById('searchKeyword').value;
            url = `${baseUrl}everything?q=${searchKeyword}&language=es&apiKey=${apiKey}`;
        } else {
            const category = document.getElementById('category').value;
            url = `${baseUrl}top-headlines?category=${category}&language=es&country=es&apiKey=${apiKey}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.articles.length === 0) {
            newsContainer.innerHTML = '<p>No se encontraron noticias</p>';
            return;
        }

        displayNews(data.articles);
    } catch (error) {
        newsContainer.innerHTML = '<p>Error al cargar las noticias</p>';
        console.error(error);
    }
}

function displayNews(articles) {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = '';

    articles.forEach(article => {
        const newsCard = `
            <div class="newsCard">
                <img src="${article.urlToImage || 'placeholder.jpg'}" alt="${article.title}">
                <div class="newsContent">
                    <h3>${article.title}</h3>
                    <p>${article.description || 'No hay descripción disponible'}</p>
                    <a href="${article.url}" target="_blank">Leer más</a>
                </div>
            </div>
        `;
        newsContainer.innerHTML += newsCard;
    });
}

document.getElementById('fetchCategory').addEventListener('click', () => fetchNews(false));

// Cargar noticias generales al iniciar
window.onload = () => fetchNews(false);