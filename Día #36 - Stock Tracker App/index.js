const symbolInput = document.querySelector('#symbol');
const stockList = document.querySelector('#stock-list');

// Función para obtener y mostrar las 10 mejores acciones
function fetchTopStocks() {
    // Mostrar mensaje de carga
    stockList.innerHTML = '<li>Cargando todas las acciones disponibles...</li>';
    
    fetch('https://www.alphavantage.co/query?function=SECTOR&apikey=YOUR_API_KEY')
        .then(response => response.json())
        .then(data => {
            if (!data['Rank A: Real-Time Performance']) {
                stockList.innerHTML = '<li class="error">No se pudieron cargar las acciones. Por favor, intente más tarde.</li>';
                return;
            }
            const stocks = data['Rank A: Real-Time Performance'];
            let html = '';
            Object.keys(stocks).forEach(symbol => {
                const change = stocks[symbol];
                const changeColor = parseFloat(change) >= 0 ? 'green' : 'red';
                html += `
                <li>
                    <span class="symbol">${symbol}</span>
                    <span class="change" style="color: ${changeColor}">${change}</span>
                </li>    
                `;
            });
            stockList.innerHTML = html;
        })
        .catch(error => {
            console.error(error);
            stockList.innerHTML = '<li class="error">Error al cargar las acciones</li>';
        });
}

// Función para obtener y mostrar datos de la acción buscada
function fetchStockData(symbol) {
    // Si la entrada está vacía, mostrar las 10 mejores acciones
    if (!symbol) {
        fetchTopStocks();
        return;
    }

    // Obtener los datos de la acción del símbolo proporcionado desde la API
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=YOUR_API_KEY`).then(response => response.json()).then(data => {
        const quote = data['Global Quote'];
        if (quote && quote['10. change percent']) {
            const changePercent = quote['10. change percent'].replace('%', '');
            const changeColor = parseFloat(changePercent) >= 0 ? 'green' : 'red';
            const html = `<li>
            <span class="symbol">${symbol}</span>
            <span class="change" style="color: ${changeColor}">${changePercent}</span>
        </li>    
        `;
            stockList.innerHTML = html;
        } else {
            stockList.innerHTML = '<li class="error">Símbolo Inválido</li>';
        }
    }).catch(error => console.error(error));

}

// Mostrar las 10 mejores al cargar la página
fetchTopStocks();

// Manejar el envío del formulario
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener el símbolo ingresado por el usuario y convertirlo a mayúsculas
    const symbol = symbolInput.value.toUpperCase();
    fetchStockData(symbol);
});