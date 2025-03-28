// Define el tamaño de cada espacio en la cuadrícula
const gridSpace = 30;

// Declarar variables
let fallingPiece;
let gridPieces = [];
let lineFades = [];
let gridWorkers = [];

let currentScore = 0;
let currentLevel = 1;
let linesCleared = 0;

let ticks = 0;
let updateEvery = 15;
let updateEveryCurrent = 15;
let fallSpeed = gridSpace * 0.5;
let pauseGame = false;
let gameOver = false;

// Define los bordes del área de juego
const gameEdgeLeft = 150;
const gameEdgeRight = 450;

// Define los colores para las piezas
const colors = [
    '#dca3ff',
    '#ff90a0',
    '#80ffb4',
    '#ff7666',
    '#70b3f5',
    '#b2e77d',
    '#ffd700',
];

// Función de configuración llamada una vez al principio
function setup() {
    createCanvas(600, 540);

    // Crear una nueva pieza que cae
    fallingPiece = new PlayPiece();
    fallingPiece.resetPiece();

    // Establecer la fuente para el texto
    textFont('Ubuntu');
}

// Función draw llamada repetidamente
function draw() {
    // Define los colores usados en el juego
    const colorDark = '#0d0d0d';
    const colorLight = '#304550';
    const colorBackground = '#e1eeb0';

    // Establecer el color de fondo
    background(colorBackground);

    // Dibujar el panel de información del lado derecho
    fill(25);
    noStroke();
    rect(gameEdgeRight, 0, 150, height);

    // Dibujar el panel de información del lado izquierdo
    rect(0, 0, gameEdgeLeft, height);

    // Dibujar el rectángulo de puntuación
    fill(colorBackground);
    rect(450, 80, 150, 70);

    // Dibujar el rectángulo de la siguiente pieza
    rect(460, 405, 130, 130, 5, 5);

    // Dibujar el rectángulo de nivel
    rect(460, 210, 130, 60, 5, 5);

    // Dibujar el rectángulo de líneas
    rect(460, 280, 130, 60, 5, 5);

    // Dibujar las líneas de puntuación
    fill(colorLight);
    rect(450, 85, 150, 20);
    rect(450, 110, 150, 4);
    rect(450, 140, 150, 4);

    // Dibujar el banner de puntuación
    fill(colorBackground);
    rect(460, 60, 130, 35, 5, 5);

    // Dibujar el rectángulo interior del banner de puntuación
    strokeWeight(3);
    noFill();
    stroke(colorLight);
    rect(465, 65, 120, 25, 5, 5);

    // Dibujar el rectángulo interior de la siguiente pieza
    stroke(colorLight);
    rect(465, 410, 120, 120, 5, 5);

    // Dibujar el rectángulo interior de nivel
    rect(465, 215, 120, 50, 5, 5);

    // Dibujar el rectángulo interior de líneas
    rect(465, 285, 120, 50, 5, 5);

    // Dibujar las etiquetas de información
    fill(25);
    noStroke();
    textSize(24);
    textAlign(CENTER);
    text("Puntuación", 525, 85);
    text("Nivel", 525, 238);
    text("Líneas", 525, 308);

    // Dibujar la información actual
    textSize(24);
    textAlign(RIGHT);
    text(currentScore, 560, 135);
    text(currentLevel, 560, 260);
    text(linesCleared, 560, 330);

    // Dibujar el borde del juego
    stroke(colorDark);
    line(gameEdgeRight, 0, gameEdgeRight, height);

    // Mostrar la pieza que cae
    fallingPiece.show();

    // Acelerar la pieza que cae si se presiona la flecha hacia abajo
    if (keyIsDown(DOWN_ARROW)) {
        updateEvery = 2;
    } else {
        updateEvery = updateEveryCurrent;
    }

    // Actualizar el estado del juego
    if (!pauseGame) {
        ticks++;
        if (ticks >= updateEvery) {
            ticks = 0;
            fallingPiece.fall(fallSpeed);
        }
    }

    // Mostrar las piezas de la cuadrícula
    for (let i = 0; i < gridPieces.length; i++) {
        gridPieces[i].show();
    }

    // Mostrar las líneas que se desvanecen
    for (let i = 0; i < lineFades.length; i++) {
        lineFades[i].show();
    }

    // Procesar los trabajadores de la cuadrícula
    if (gridWorkers.length > 0) {
        gridWorkers[0].work();
    }

    // Explicar los controles
    textAlign(CENTER);
    fill(255);
    noStroke();
    textSize(14);
    text("Controles:\n↑\n← ↓ →\n", 75, 155);
    text("Izquierda y Derecha:\nmover de lado a lado", 75, 230);
    text("Arriba:\nrotar", 75, 280);
    text("Abajo:\ncaer más rápido", 75, 330);
    text("R:\nreiniciar juego", 75, 380);

    // Mostrar el texto de fin de juego
    if (gameOver) {
        fill(colorDark);
        textSize(54);
        textAlign(CENTER);
        text("¡Juego Terminado!", 300, 270);
    }

    // Dibujar el borde del juego
    strokeWeight(3);
    stroke('#304550');
    noFill();
    rect(0, 0, width, height);
}

// Función llamada cuando se presiona una tecla
function keyPressed() {
    if (keyCode === 82) {
        // Tecla 'R'
        resetGame();
    }
    if (!pauseGame) {
        if (keyCode === LEFT_ARROW) {
            fallingPiece.input(LEFT_ARROW);
        } else if (keyCode === RIGHT_ARROW) {
            fallingPiece.input(RIGHT_ARROW);
        }
        if (keyCode === UP_ARROW) {
            fallingPiece.input(UP_ARROW);
        }
    }
}

// Clase para la pieza que cae
class PlayPiece {
    constructor() {
        this.pos = createVector(0, 0);
        this.rotation = 0;
        this.nextPieceType = Math.floor(Math.random() * 7);
        this.nextPieces = [];
        this.pieceType = 0;
        this.pieces = [];
        this.orientation = [];
        this.fallen = false;
    }

    // Generar la siguiente pieza
    nextPiece() {
        this.nextPieceType = pseudoRandom(this.pieceType);
        this.nextPieces = [];

        const points = orientPoints(this.nextPieceType, 0);
        let xx = 525, yy = 490;

        if (this.nextPieceType !== 0 && this.nextPieceType !== 3 && this.nextPieceType !== 5) {
            xx += (gridSpace * 0.5);
        }

        if (this.nextPieceType == 5) {
            xx -= (gridSpace * 0.5);
        }

        for (let i = 0; i < 4; i++) {
            this.nextPieces.push(new Square(xx + points[i][0] * gridSpace, yy + points[i][1] * gridSpace, this.nextPieceType));
        }
    }

    // Hacer que la pieza caiga
    fall(amount) {
        if (!this.futureCollision(0, amount, this.rotation)) {
            this.addPos(0, amount);
            this.fallen = true;
        } else {
            if (!this.fallen) {
                pauseGame = true;
                gameOver = true;
            } else {
                this.commitShape();
            }
        }
    }

    // Reiniciar la pieza actual
    resetPiece() {
        this.rotation = 0;
        this.fallen = false;
        this.pos.x = 330;
        this.pos.y = -60;

        this.pieceType = this.nextPieceType;

        this.nextPiece();
        this.newPoints();
    }

    // Generar los puntos para la pieza actual
    newPoints() {
        const points = orientPoints(this.pieceType, this.rotation);
        this.orientation = points;
        this.pieces = [];

        for (let i = 0; i < points.length; i++) {
            this.pieces.push(new Square(this.pos.x + points[i][0] * gridSpace, this.pos.y + points[i][1] * gridSpace, this.pieceType));
        }
    }

    // Actualizar la posición de la pieza actual
    updatePoints() {
        if (this.pieces) {
            const points = orientPoints(this.pieceType, this.rotation);
            this.orientation = points;
            for (let i = 0; i < 4; i++) {
                this.pieces[i].pos.x = this.pos.x + points[i][0] * gridSpace;
                this.pieces[i].pos.y = this.pos.y + points[i][1] * gridSpace;
            }
        }
    }

    // Añadir un desplazamiento a la posición de la pieza actual
    addPos(x, y) {
        this.pos.x += x;
        this.pos.y += y;

        if (this.pieces) {
            for (let i = 0; i < 4; i++) {
                this.pieces[i].pos.x += x;
                this.pieces[i].pos.y += y;
            }
        }
    }

    // Comprobar si habrá una colisión en el futuro
    futureCollision(x, y, rotation) {
        let xx, yy, points = 0;
        if (rotation !== this.rotation) {
            points = orientPoints(this.pieceType, rotation);
        }

        for (let i = 0; i < this.pieces.length; i++) {
            if (points) {
                xx = this.pos.x + points[i][0] * gridSpace;
                yy = this.pos.y + points[i][1] * gridSpace;
            } else {
                xx = this.pieces[i].pos.x + x;
                yy = this.pieces[i].pos.y + y;
            }
            if (xx < gameEdgeLeft || xx + gridSpace > gameEdgeRight || yy + gridSpace > height) {
                return true;
            }
            for (let j = 0; j < gridPieces.length; j++) {
                if (xx === gridPieces[j].pos.x) {
                    if (yy >= gridPieces[j].pos.y && yy < gridPieces[j].pos.y + gridSpace) {
                        return true;
                    }
                    if (yy + gridSpace > gridPieces[j].pos.y && yy + gridSpace <= gridPieces[j].pos.y + gridSpace) {
                        return true;
                    }
                }
            }
        }
    }

    // Manejar entrada del usuario
    input(key) {
        switch (key) {
            case LEFT_ARROW:
                if (!this.futureCollision(-gridSpace, 0, this.rotation)) {
                    this.addPos(-gridSpace, 0);
                }
                break;
            case RIGHT_ARROW:
                if (!this.futureCollision(gridSpace, 0, this.rotation)) {
                    this.addPos(gridSpace, 0);
                }
                break;
            case UP_ARROW:
                let newRotation = this.rotation + 1;
                if (newRotation > 3) {
                    newRotation = 0;
                }
                if (!this.futureCollision(0, 0, newRotation)) {
                    this.rotation = newRotation;
                    this.updatePoints();
                }
                break;
        }
    }

    // Rotar la pieza actual
    rotate() {
        this.rotation += 1;
        if (this.rotation > 3) {
            this.rotation = 0;
        }
        this.updatePoints();
    }

    // Mostrar la pieza actual
    show() {
        for (let i = 0; i < this.pieces.length; i++) {
            this.pieces[i].show();
        }
        for (let i = 0; i < this.nextPieces.length; i++) {
            this.nextPieces[i].show();
        }
    }

    // Confirmar la forma actual en la cuadrícula
    commitShape() {
        for (let i = 0; i < this.pieces.length; i++) {
            gridPieces.push(this.pieces[i]);
        }
        this.resetPiece();
        analyzeGrid();
    }
}

// Clase para cada cuadrado en una pieza
class Square {
    constructor(x, y, type) {
        this.pos = createVector(x, y);
        this.type = type;
    }

    // Mostrar el cuadrado
    show() {
        strokeWeight(2);
        const colorDark = '#092e1d';
        const colorMid = colors[this.type];

        fill(colorMid);
        stroke(25);
        rect(this.pos.x, this.pos.y, gridSpace - 1, gridSpace - 1);

        noStroke();
        fill(255);
        rect(this.pos.x + 6, this.pos.y + 6, 18, 2);
        rect(this.pos.x + 6, this.pos.y + 6, 2, 16);
        fill(25);
        rect(this.pos.x + 6, this.pos.y + 20, 18, 2);
        rect(this.pos.x + 22, this.pos.y + 6, 2, 16);
    }
}

// Generar un número pseudo-aleatorio para la siguiente pieza
function pseudoRandom(previous) {
    let roll = Math.floor(Math.random() * 8);
    if (roll === previous || roll === 7) {
        roll = Math.floor(Math.random() * 7);
    }
    return roll;
}

// Analizar la cuadrícula y limpiar líneas si es necesario
function analyzeGrid() {
    let score = 0;
    while (checkLines()) {
        score += 100;
        linesCleared += 1;
        if (linesCleared % 10 === 0) {
            currentLevel += 1;
            if (updateEveryCurrent > 2) {
                updateEveryCurrent -= 10;
            }
        }
    }
    if (score > 100) {
        score *= 2;
    }
    currentScore += score;
}

// Comprobar si hay líneas completas en la cuadrícula
function checkLines() {
    for (let y = 0; y < height; y += gridSpace) {
        let count = 0;
        for (let i = 0; i < gridPieces.length; i++) {
            if (gridPieces[i].pos.y === y) {
                count++;
            }
        }
        if (count === 10) {
            // Eliminar las piezas en esta coordenada y
            gridPieces = gridPieces.filter(piece => piece.pos.y !== y);
            // Mover hacia abajo las piezas por encima de esta coordenada y
            for (let i = 0; i < gridPieces.length; i++) {
                if (gridPieces[i].pos.y < y) {
                    gridPieces[i].pos.y += gridSpace;
                }
            }
            return true;
        }
    }
    return false;
}

// Clase para el trabajador de la cuadrícula
class Worker {
    constructor(y, amount) {
        this.amountActual = 0;
        this.amountTotal = amount;
        this.yVal = y;
    }

    // Realizar trabajo en la cuadrícula
    work() {
        if (this.amountActual < this.amountTotal) {
            for (let j = 0; j < gridPieces.length; j++) {
                if (gridPieces[j].pos.y < y) {
                    gridPieces[j].pos.y += 5;
                }
            }
            this.amountActual += 5;
        } else {
            gridWorkers.shift();
        }
    }
}

// Reiniciar el estado del juego
function resetGame() {
    fallingPiece = new PlayPiece();
    fallingPiece.resetPiece();
    gridPieces = [];
    lineFades = [];
    gridWorkers = [];
    currentScore = 0;
    currentLevel = 1;
    linesCleared = 0;
    ticks = 0;
    updateEvery = 15;
    updateEveryCurrent = 15;
    fallSpeed = gridSpace * 0.5;
    pauseGame = false;
    gameOver = false;
}