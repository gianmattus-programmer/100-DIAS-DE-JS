let tiempoInicio, tiempoFin;
let tamañoImagen = "";
let imagen = new Image();
let velocidadBits = document.getElementById("bits"),
    velocidadKb = document.getElementById("kbs"),
    velocidadMb = document.getElementById("mbs"),
    info = document.getElementById("info");

let velocidadTotalBits = 0;
let velocidadTotalKb = 0;
let velocidadTotalMb = 0;
let numPruebas = 1;
let pruebasCompletadas = 0;

// Obtener imagen aleatoria de unsplash.com
let apiImagen = "https://source.unsplash.com/random?topic=nature";

// Cuando la imagen carga
imagen.onload = async function () {
    tiempoFin = new Date().getTime();

    // Obtener tamaño de imagen
    await fetch(apiImagen).then((respuesta) => {
        tamañoImagen = respuesta.headers.get("content-length");
        calcularVelocidad();
    });
};

// Función para calcular la velocidad
function calcularVelocidad() {
    // Tiempo transcurrido en segundos
    let duracionTiempo = (tiempoFin - tiempoInicio) / 1000;
    // Total de bits
    let bitsDescargados = tamañoImagen * 8;
    let velocidadEnBits = bitsDescargados / duracionTiempo;
    let velocidadEnKbs = velocidadEnBits / 1024;
    let velocidadEnMbs = velocidadEnKbs / 1024;

    velocidadTotalBits += velocidadEnBits;
    velocidadTotalKb += velocidadEnKbs;
    velocidadTotalMb += velocidadEnMbs;

    pruebasCompletadas++;

    // Si todas las pruebas están completadas (obtenemos 5 imágenes y calculamos el promedio)
    if (pruebasCompletadas === numPruebas) {
        let velocidadPromedioBps = (velocidadTotalBits / numPruebas).toFixed(2);
        let velocidadPromedioKbps = (velocidadTotalKb / numPruebas).toFixed(2);
        let velocidadPromedioMbps = (velocidadTotalMb / numPruebas).toFixed(2);

        // Mostrar velocidades promedio
        velocidadBits.innerHTML += `${velocidadPromedioBps}`;
        velocidadKb.innerHTML += `${velocidadPromedioKbps}`;
        velocidadMb.innerHTML += `${velocidadPromedioMbps}`;
        info.innerHTML = "¡Prueba Completada!";
    } else {
        // Ejecutar la siguiente prueba
        tiempoInicio = new Date().getTime();
        imagen.src = apiImagen;
    }
}

// Función inicial para comenzar las pruebas
const iniciar = async () => {
    info.innerHTML = "Probando...";
    tiempoInicio = new Date().getTime();
    imagen.src = apiImagen;
};

// Ejecutar pruebas cuando la ventana cargue
window.onload = () => {
    for (let i = 0; i < numPruebas; i++) {
        iniciar();
    }
};