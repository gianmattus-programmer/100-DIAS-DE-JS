const API_KEY = 'Your_Api_Key';

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Función para eliminar etiquetas html de una cadena
function stripHtmlTags(input) {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.body.textContent || "";
}

// Función para obtener juegos de un año y mes específico desde la Api
function fetchGamesForMonth(year, month) {
    // Actualizando el estilo de visualización de los botones de navegación según la fecha actual
    document.getElementById('prevMonth').style.display = (month <= new Date().getMonth() - 1 && year === new Date().getFullYear()) ? 'none' : 'block';
    document.getElementById('nextMonth').style.display = (month >= new Date().getMonth() + 1 && year === new Date().getFullYear()) ? 'none' : 'block';

    // Realizando la petición a la Api para obtener juegos
    fetch(`https://api.rawg.io/api/games?dates=${year}-${month + 1}-01,${year}-${month + 1}-30&key=${API_KEY}`).then(response => response.json()).then(data => {
        // Filtrando juegos para incluir solo los que tienen imágenes de fondo
        const games = data.results.filter(game => game.background_image);

        // Calculando el número de días en el mes dado
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let htmlContent = '';
        for (let i = 1; i <= daysInMonth; i++) {
            let gamesForDay = games.filter(game => new Date(game.released).getDate() === i);

            htmlContent += `

            <div class="date">
                <strong>${i}</strong>
                ${gamesForDay.map(game => `
                    <div class="game" data-id="${game.id}">
                        <img src="${game.background_image}" alt="${game.name} Thumbnail">
                        <div class="game-details">${game.name}</div>
                    </div>
                `).join('')}
            </div>
            `;
        }

        document.getElementById('calendar').innerHTML = htmlContent;
        document.getElementById('currentMonthYear').innerText = `${monthNames[month]} ${year}`;

        // Add click event listener for each game to show modal
        document.querySelectorAll('.game').forEach(gameEl => {
            gameEl.addEventListener('click', () => {
                const gameId = gameEl.getAttribute('data-id');

                // Fetch game details
                fetch(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`).then(response => response.json()).then(gameDetails => {
                    document.getElementById('gameTitle').innerText = gameDetails.name;
                    document.getElementById('gameImage').src = gameDetails.background_image;

                    const descriptionElement = document.querySelector('.modal-content p strong');
                    descriptionElement.nextSibling.nodeValue = " " + stripHtmlTags(gameDetails.description || "No description available.");

                    document.getElementById('gameReleaseDate').innerText = gameDetails.released;
                    document.getElementById('gameRating').innerText = gameDetails.rating;
                    document.getElementById('gamePlatforms').innerText = gameDetails.platforms.map(platform => platform.platform.name).join(', ');
                    document.getElementById('gameModal').style.display = 'block';
                });
            });
        });
    });
}

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    fetchGamesForMonth(currentYear, currentMonth);
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    fetchGamesForMonth(currentYear, currentMonth);
});

// Función para cerrar modal
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('gameModal').style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('gameModal')) {
        document.getElementById('gameModal').style.display = 'none';
    }
});

fetchGamesForMonth(currentYear, currentMonth);