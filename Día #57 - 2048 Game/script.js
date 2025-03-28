document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const size = 4;
    let board = [];
    let currentScore = 0;
    const currentScoreElem = document.getElementById('current-score');

    // Obtener la puntuación más alta del almacenamiento local o establecerla en 0 si no se encuentra
    let highScore = localStorage.getItem('2048-highScore') || 0;
    const highScoreElem = document.getElementById('high-score');
    highScoreElem.textContent = highScore;

    const gameOverElem = document.getElementById('game-over');

    // Función para actualizar la puntuación
    function actualizarPuntuacion(value) {
        currentScore += value;
        currentScoreElem.textContent = currentScore;
        if (currentScore > highScore) {
            highScore = currentScore;
            highScoreElem.textContent = highScore;
            localStorage.setItem('2048-highScore', highScore);
        }
    }

    // Función para reiniciar el juego
    function reiniciarJuego() {
        currentScore = 0;
        currentScoreElem.textContent = '0';
        gameOverElem.style.display = 'none';
        inicializarJuego();
    }

    // Función para inicializar el juego
    function inicializarJuego() {
        board = [...Array(size)].map(e => Array(size).fill(0));
        colocarFichaAleatoria();
        colocarFichaAleatoria();
        renderizarTablero();
    }

    // Función para renderizar el tablero de juego en la interfaz
    function renderizarTablero() {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                const prevValue = cell.dataset.value;
                const currentValue = board[i][j];
                if (currentValue !== 0) {
                    cell.dataset.value = currentValue;
                    cell.textContent = currentValue;
                    // Manejo de animación
                    if (currentValue !== parseInt(prevValue) && !cell.classList.contains('new-tile')) {
                        cell.classList.add('merged-tile');
                    }
                } else {
                    cell.textContent = '';
                    delete cell.dataset.value;
                    cell.classList.remove('merged-tile', 'new-tile');
                }
            }
        }

        // Limpiar clases de animación
        setTimeout(() => {
            const cells = document.querySelectorAll('.grid-cell');
            cells.forEach(cell => {
                cell.classList.remove('merged-tile', 'new-tile');
            });
        }, 300);
    }

    // Función para colocar una ficha aleatoria en el tablero
    function colocarFichaAleatoria() {
        const available = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === 0) {
                    available.push({ x: i, y: j });
                }
            }
        }

        if (available.length > 0) {
            const randomCell = available[Math.floor(Math.random() * available.length)];
            board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
            const cell = document.querySelector(`[data-row="${randomCell.x}"][data-col="${randomCell.y}"]`);
            cell.classList.add('new-tile'); // Animación para nuevas fichas
        }
    }

    // Función para mover las fichas según la entrada de las teclas de flecha
    function mover(direction) {
        let hasChanged = false;
        if (direction === 'ArrowUp' || direction === 'ArrowDown') {
            for (let j = 0; j < size; j++) {
                const column = [...Array(size)].map((_, i) => board[i][j]);
                const newColumn = transformar(column, direction === 'ArrowUp');
                for (let i = 0; i < size; i++) {
                    if (board[i][j] !== newColumn[i]) {
                        hasChanged = true;
                        board[i][j] = newColumn[i];
                    }
                }
            }
        } else if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
            for (let i = 0; i < size; i++) {
                const row = board[i];
                const newRow = transformar(row, direction === 'ArrowLeft');
                if (row.join(',') !== newRow.join(',')) {
                    hasChanged = true;
                    board[i] = newRow;
                }
            }
        }
        if (hasChanged) {
            colocarFichaAleatoria();
            renderizarTablero();
            verificarFinJuego();
        }
    }

    // Función para transformar una línea (fila o columna) según la dirección del movimiento
    function transformar(line, moverHaciaInicio) {
        let newLine = line.filter(cell => cell !== 0);
        if (!moverHaciaInicio) {
            newLine.reverse();
        }
        for (let i = 0; i < newLine.length - 1; i++) {
            if (newLine[i] === newLine[i + 1]) {
                newLine[i] *= 2;
                actualizarPuntuacion(newLine[i]); // Actualizar puntuación cuando las fichas se fusionan
                newLine.splice(i + 1, 1);
            }
        }
        while (newLine.length < size) {
            newLine.push(0);
        }
        if (!moverHaciaInicio) {
            newLine.reverse();
        }
        return newLine;
    }

    // Función para verificar si el juego ha terminado
    function verificarFinJuego() {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === 0) {
                    return; // Hay una celda vacía, así que el juego no ha terminado
                }
                if (j < size - 1 && board[i][j] === board[i][j + 1]) {
                    return; // Hay celdas adyacentes horizontalmente iguales, así que es posible un movimiento
                }
                if (i < size - 1 && board[i][j] === board[i + 1][j]) {
                    return; // Hay celdas adyacentes verticalmente iguales, así que es posible un movimiento
                }
            }
        }

        // Si llegamos aquí, no hay movimientos posibles
        gameOverElem.style.display = 'flex';
    }

    // Eventos del listener
    document.addEventListener('keydown', event => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            mover(event.key);
        }
    });
    document.getElementById('restart-btn').addEventListener('click', reiniciarJuego);

    inicializarJuego();

});