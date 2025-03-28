// Esperar a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    let board = null; // Inicializar el tablero de ajedrez
    const game = new Chess(); // Crear nueva instancia del juego Chess.js
    const moveHistory = document.getElementById('move-history'); // Obtener el contenedor del historial de movimientos
    let moveCount = 1; // Inicializar el contador de movimientos
    let userColor = 'w'; // Inicializar el color del usuario como blanco

    // Función para hacer un movimiento aleatorio para la computadora
    const makeRandomMove = () => {
        const possibleMoves = game.moves();

        if (game.game_over()) {
            alert("¡Jaque mate!");
        } else {
            const randomIdx = Math.floor(Math.random() * possibleMoves.length);
            const move = possibleMoves[randomIdx];
            game.move(move);
            board.position(game.fen());
            recordMove(move, moveCount); // Registrar y mostrar el movimiento con el contador de movimientos
            moveCount++; // Incrementar el contador de movimientos
        }
    };

    // Función para registrar y mostrar un movimiento en el historial
    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight; // Desplazarse automáticamente al último movimiento
    };

    // Función para manejar el inicio de un arrastre
    const onDragStart = (source, piece) => {
        // Permitir al usuario arrastrar solo sus propias piezas según el color
        return !game.game_over() && piece.search(userColor) === 0;
    };

    // Función para manejar cuando se suelta una pieza en el tablero
    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q',
        });

        if (move === null) return 'snapback';

        window.setTimeout(makeRandomMove, 250);
        recordMove(move.san, moveCount); // Registrar y mostrar el movimiento con el contador de movimientos
        moveCount++;
    };

    // Función para manejar el final de la animación de ajuste de una pieza
    const onSnapEnd = () => {
        board.position(game.fen());
    };

    // Opciones de configuración para el tablero de ajedrez
    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'fast',
        snapBackSpeed: 500,
        snapSpeed: 100,
    };

    // Inicializar el tablero de ajedrez
    board = Chessboard('board', boardConfig);

    // Controlador de eventos para el botón "Jugar de nuevo"
    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset();
        board.start();
        moveHistory.textContent = '';
        moveCount = 1;
        userColor = 'w';
    });

    // Controlador de eventos para el botón "Establecer posición"
    document.querySelector('.set-pos').addEventListener('click', () => {
        const fen = prompt("¡Ingrese la notación FEN para la posición deseada!");
        if (fen !== null) {
            if (game.load(fen)) {
                board.position(fen);
                moveHistory.textContent = '';
                moveCount = 1;
                userColor = 'w';
            } else {
                alert("Notación FEN inválida. Por favor intente de nuevo.");
            }
        }
    });

    // Controlador de eventos para el botón "Voltear tablero"
    document.querySelector('.flip-board').addEventListener('click', () => {
        board.flip();
        makeRandomMove();
        // Alternar el color del usuario después de voltear el tablero
        userColor = userColor === 'w' ? 'b' : 'w';
    });

});