document.addEventListener('DOMContentLoaded', function () {
    const tamañoCuadricula = 9;
    const botonResolver = document.getElementById("solve-btn");
    botonResolver.addEventListener('click', resolverSudoku);

    const cuadriculaSudoku = document.getElementById("sudoku-grid");
    // Crear la cuadrícula del sudoku y las celdas de entrada
    for (let fila = 0; fila < tamañoCuadricula; fila++) {
        const nuevaFila = document.createElement("tr");
        for (let col = 0; col < tamañoCuadricula; col++) {
            const celda = document.createElement("td");
            const entrada = document.createElement("input");
            entrada.type = "number";
            entrada.className = "cell";
            entrada.id = `cell-${fila}-${col}`;
            celda.appendChild(entrada);
            nuevaFila.appendChild(celda);
        }
        cuadriculaSudoku.appendChild(nuevaFila);
    }
});

async function resolverSudoku() {
    const tamañoCuadricula = 9;
    const arregloSudoku = [];

    // Llenar el arregloSudoku con valores de entrada de la cuadrícula
    for (let fila = 0; fila < tamañoCuadricula; fila++) {
        arregloSudoku[fila] = [];
        for (let col = 0; col < tamañoCuadricula; col++) {
            const idCelda = `cell-${fila}-${col}`;
            const valorCelda = document.getElementById(idCelda).value;
            arregloSudoku[fila][col] = valorCelda !== "" ? parseInt(valorCelda) : 0;
        }
    }

    // Identificar celdas ingresadas por el usuario y marcarlas
    for (let fila = 0; fila < tamañoCuadricula; fila++) {
        for (let col = 0; col < tamañoCuadricula; col++) {
            const idCelda = `cell-${fila}-${col}`;
            const celda = document.getElementById(idCelda);

            if (arregloSudoku[fila][col] !== 0) {
                celda.classList.add("user-input");
            }
        }
    }

    // Resolver el sudoku y mostrar la solución
    if (ayudanteResolverSudoku(arregloSudoku)) {
        for (let fila = 0; fila < tamañoCuadricula; fila++) {
            for (let col = 0; col < tamañoCuadricula; col++) {
                const idCelda = `cell-${fila}-${col}`;
                const celda = document.getElementById(idCelda);

                // Rellenar valores resueltos y aplicar animación
                if (!celda.classList.contains("user-input")) {
                    celda.value = arregloSudoku[fila][col];
                    celda.classList.add("solved");
                    await esperar(20); // Agregar un retraso para visualización
                }
            }
        }
    } else {
        alert("No existe solución para este puzzle de Sudoku.");
    }
}

function ayudanteResolverSudoku(tablero) {
    const tamañoCuadricula = 9;

    for (let fila = 0; fila < tamañoCuadricula; fila++) {
        for (let col = 0; col < tamañoCuadricula; col++) {
            if (tablero[fila][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (esMovimientoValido(tablero, fila, col, num)) {
                        tablero[fila][col] = num;

                        // Intentar resolver el Sudoku recursivamente
                        if (ayudanteResolverSudoku(tablero)) {
                            return true; // Puzzle resuelto
                        }

                        tablero[fila][col] = 0; // Retroceder
                    }
                }
                return false; // No se encontró número válido
            }
        }
    }

    return true; // Todas las celdas llenas
}

function esMovimientoValido(tablero, fila, col, num) {
    const tamañoCuadricula = 9;

    // Verificar fila y columna para conflictos
    for (let i = 0; i < tamañoCuadricula; i++) {
        if (tablero[fila][i] === num || tablero[i][col] === num) {
            return false; // Conflicto encontrado
        }
    }

    // Verificar la subcuadrícula 3*3 para conflictos
    const inicioFila = Math.floor(fila / 3) * 3;
    const inicioCol = Math.floor(col / 3) * 3;

    for (let i = inicioFila; i < inicioFila + 3; i++) {
        for (let j = inicioCol; j < inicioCol + 3; j++) {
            if (tablero[i][j] === num) {
                return false; // Conflicto encontrado
            }
        }
    }

    return true; // No se encontraron conflictos
}

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}