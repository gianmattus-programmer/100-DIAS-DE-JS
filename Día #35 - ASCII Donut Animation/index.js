(function () {
    var preTag = document.getElementById('donut');

    // Ángulos, Radio y Constantes
    var A = 1;
    var B = 1;
    var R1 = 1;
    var R2 = 2;
    var K1 = 150;
    var K2 = 5;

    // Función para renderizar el frame ASCII
    function renderAsciiFrame() {
        var b = []; // Array para almacenar caracteres ascii
        var z = []; // Array para almacenar valores de profundidad

        var width = 280; // Ancho del frame
        var height = 160; // Alto del frame

        A += 0.07; // Incrementar ángulo A
        B += 0.03; // Incrementar ángulo B
        // Seno y Coseno de los ángulos
        var cA = Math.cos(A),
            sA = Math.sin(A),
            cB = Math.cos(B),
            sB = Math.sin(B);

        // Inicializar arrays con ángulos predeterminados
        for (var k = 0; k < width * height; k++) {
            // Establecer carácter ascii predeterminado
            b[k] = k % width == width - 1 ? '\n' : ' ';
            // Establecer profundidad predeterminada
            z[k] = 0;
        }

        // Generar el frame ASCII
        for (var j = 0; j < 6.28; j += 0.07) {
            var ct = Math.cos(j); // Coseno de j
            var st = Math.sin(j); // Seno de j

            for (var i = 0; i < 6.28; i += 0.02) {
                var sp = Math.sin(i); // Seno de i
                cp = Math.cos(i), // Coseno de i
                    h = ct + 2, // Cálculo de altura
                    // Cálculo de distancia
                    D = 1 / (sp * h * sA + st * cA + 5),
                    // Variable temporal
                    t = sp * h * cA - st * sA;

                // Calcular coordenadas del carácter ASCII
                var x = Math.floor(width / 2 + (width / 4) * D * (cp * h * cB - t * sB));
                var y = Math.floor(height / 2 + (height / 4) * D * (cp * h * sB + t * cB));

                // Calcular el índice en el array
                var o = x + width * y;
                // Calcular el índice del carácter ASCII
                var N = Math.floor(8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB));

                // Actualizar carácter ASCII y profundidad si se cumplen las condiciones
                if (y < height && y >= 0 && x >= 0 && x < width && D > z[o]) {
                    z[o] = D;
                    // Actualizar carácter ASCII basado en el índice
                    b[o] = '.,-~:;=!*#$@'[N > 0 ? N : 0];
                }

            }

        }

        // Actualizar elemento html con el frame ASCII
        preTag.innerHTML = b.join('');

    }

    // Función para iniciar la animación
    function startAsciiAnimation() {
        // Iniciar llamando a renderAsciiFrame cada 50ms
        window.asciiIntervalId = setInterval(renderAsciiFrame, 50);
    }

    renderAsciiFrame(); // Renderizar el frame ASCII inicial
    // Agregar evento listener para iniciar la animación cuando la página esté cargada
    if (document.all) {
        // Para versiones antiguas de Internet Explorer
        window.attachEvent('onload', startAsciiAnimation);
    } else {
        // Para navegadores modernos
        window.addEventListener('load', startAsciiAnimation, false);
    }

    // Agregar evento listener para actualizar el frame ASCII cuando se redimensione la ventana
    window.addEventListener('resize', renderAsciiFrame);
})();