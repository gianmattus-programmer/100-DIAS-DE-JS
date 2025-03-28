const claveApi = "YOUR_API_KEY";

const maximoImagenes = 4; // Número de imágenes a generar por cada prompt
let numeroImagenSeleccionada = null;

// Función para generar un número aleatorio entre min y max (inclusive)
function obtenerNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para deshabilitar el botón generar durante el procesamiento
function deshabilitarBotonGenerar() {
    document.getElementById("generate").disabled = true;
}

// Función para habilitar el botón generar después del proceso
function habilitarBotonGenerar() {
    document.getElementById("generate").disabled = false;
}

// Función para limpiar la cuadrícula de imágenes
function limpiarCuadriculaImagenes() {
    const cuadriculaImagenes = document.getElementById("image-grid");
    cuadriculaImagenes.innerHTML = "";
}

// Función para generar imágenes
async function generarImagenes(entrada) {
    deshabilitarBotonGenerar();
    limpiarCuadriculaImagenes();

    const cargando = document.getElementById("loading");
    cargando.style.display = "block";

    const urlsImagenes = [];

    for (let i = 0; i < maximoImagenes; i++) {
        // Generar un número aleatorio entre 1 y 10000 y añadirlo al prompt
        const numeroAleatorio = obtenerNumeroAleatorio(1, 10000);
        const prompt = `${entrada} ${numeroAleatorio}`;
        // Se añadió un número aleatorio al prompt para crear resultados diferentes
        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${claveApi}`,
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            alert("¡Error al generar la imagen!");
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        urlsImagenes.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `arte-${i + 1}`;
        img.onclick = () => descargarImagen(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }

    cargando.style.display = "none";
    habilitarBotonGenerar();

    numeroImagenSeleccionada = null; // Reiniciar número de imagen seleccionada
}

document.getElementById("generate").addEventListener('click', () => {
    const entrada = document.getElementById("user-prompt").value;
    generarImagenes(entrada);
});

function descargarImagen(urlImagen, numeroImagen) {
    const enlace = document.createElement("a");
    enlace.href = urlImagen;
    // Establecer nombre del archivo basado en la imagen seleccionada
    enlace.download = `imagen-${numeroImagen + 1}.jpg`;
    enlace.click();
}