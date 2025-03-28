const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const gameOverScreen = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

const GRID_SIZE = 20;
const SNAKE_SIZE = GRID_SIZE;
const FOOD_SIZE = GRID_SIZE;

let snake, food, dx, dy, blinkCounter;
let gamePaused = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

let currentScoreElem = document.getElementById('current-score');
let highScoreElem = document.getElementById('high-score');

// Inicializar estado del juego
function initializeGame() {
    // Establecer segmentos iniciales de la serpiente
    snake = [
        { x: Math.floor(canvas.width / 2 / GRID_SIZE) * GRID_SIZE, y: Math.floor(canvas.height / 2 / GRID_SIZE) * GRID_SIZE },
        { x: Math.floor(canvas.width / 2 / GRID_SIZE) * GRID_SIZE, y: (Math.floor(canvas.height / 2 / GRID_SIZE) + 1) * GRID_SIZE },
    ];
    // Establecer la posición y dirección inicial de la comida
    food = {
        ...generateFoodPosition(),
        dx: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE,
        dy: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE
    };
    // Establecer dirección inicial de la serpiente
    dx = 0;
    dy = -GRID_SIZE;
    blinkCounter = 0;
    score = 0;
    currentScoreElem.textContent = score;
    highScoreElem.textContent = highScore;
}

initializeGame();

// Manejar entradas del teclado para el movimiento de la serpiente
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            if (dy === 0) {
                dx = 0;
                dy = -GRID_SIZE;
            }
            break;
        case 'ArrowDown':
            if (dy === 0) {
                dx = 0;
                dy = GRID_SIZE;
            }
            break;
        case 'ArrowLeft':
            if (dx === 0) {
                dx = -GRID_SIZE;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx === 0) {
                dx = GRID_SIZE;
                dy = 0;
            }
            break;
    }
});

// Generar una posición de comida que no colisione con la serpiente
function generateFoodPosition() {
    while (true) {
        let newFoodPosition = {
            x: Math.floor(Math.random() * canvas.width / GRID_SIZE) * GRID_SIZE,
            y: Math.floor(Math.random() * canvas.height / GRID_SIZE) * GRID_SIZE
        };

        let collisionWithSnake = false;
        for (let segment of snake) {
            if (segment.x === newFoodPosition.x && segment.y === newFoodPosition.y) {
                collisionWithSnake = true;
                break;
            }
        }

        // Devolver la posición si no hay colisión
        if (!collisionWithSnake) {
            return newFoodPosition;
        }
    }
}

// Verificar colisiones con la pared o con sí misma
function checkCollision() {
    if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

// Función principal de actualización del juego
function update() {
    if (gamePaused) return;

    // Calcular nueva posición de la cabeza de la serpiente
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Verificar colisiones
    if (checkCollision()) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreElem.textContent = highScore;
        }
        gameOver();
        return;
    }

    // Verificar si la serpiente come la comida
    if (head.x === food.x && head.y === food.y) {
        score++;
        currentScoreElem.textContent = score;
        food = {
            ...generateFoodPosition(),
            dx: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE,
            dy: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE
        };

        // Verificar condición de victoria (la serpiente llena toda la pantalla)
        if (snake.length === (canvas.width / GRID_SIZE) * (canvas.height / GRID_SIZE)) {
            gameWin();
            return;
        }
    } else {
        snake.pop(); // Eliminar segmento de la cola
    }

    // Actualizar posición de la comida
    if (blinkCounter % 4 === 0) {
        food.x += food.dx;
        food.y += food.dy;

        // Manejar colisiones de la comida con la pared
        if (food.x < 0) {
            food.dx = -food.dx;
            food.x = 0;
        }
        if (food.x >= canvas.width) {
            food.dx = -food.dx;
            food.x = canvas.width - GRID_SIZE;
        }
        if (food.y < 0) {
            food.dy = -food.dy;
            food.y = 0;
        }
        if (food.y >= canvas.height) {
            food.dy = -food.dy;
            food.y = canvas.height - GRID_SIZE;
        }
    }

    blinkCounter++;
    draw(); // Dibujar los objetos del juego
}

// Dibujar la cuadrícula de fondo
function drawGrid() {
    context.strokeStyle = "#AAA";
    for (let i = 0; i < canvas.width; i += GRID_SIZE) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, canvas.height);
        context.stroke();
    }
    for (let j = 0; j < canvas.height; j += GRID_SIZE) {
        context.beginPath();
        context.moveTo(0, j);
        context.lineTo(canvas.width, j);
        context.stroke();
    }
}

// Dibujar objetos del juego (serpiente y comida)
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    for (const segment of snake) {
        context.fillStyle = 'green';
        context.fillRect(segment.x, segment.y, SNAKE_SIZE, SNAKE_SIZE);
    }
    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, FOOD_SIZE, FOOD_SIZE);
}

// Manejar estado de juego terminado
function gameOver() {
    gamePaused = true;
    gameOverScreen.style.display = 'flex';
}

// Manejar estado de juego ganado
function gameWin() {
    gamePaused = true;
    alert("¡Felicitaciones! ¡Has ganado!");
    initializeGame();
}

// Reiniciar juego cuando se hace clic en el botón de reinicio
restartBtn.addEventListener('click', function () {
    gameOverScreen.style.display = 'none';
    gamePaused = false;
    initializeGame();
    update();
});

// Llamar a la función update cada 100ms
setInterval(update, 100);

// Pausar el juego cuando la ventana pierde el foco
window.addEventListener('blur', function () {
    gamePaused = true;
});

// Reanudar el juego cuando la ventana recupera el foco
window.addEventListener('focus', function () {
    gamePaused = false;
    update();
});