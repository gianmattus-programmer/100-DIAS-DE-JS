const pickBtn = document.getElementById("pick-btn");
const fileInput = document.getElementById("file");
const image = document.getElementById("image");
const hexInput = document.getElementById("hex-input");
const rgbInput = document.getElementById("rgb-input");
const pickedColor = document.getElementById("picked-color");

// Inicializar Eyedropper si es compatible
const initEyeDropper = () => {
    if ("EyeDropper" in window) {
        pickBtn.classList.remove("hide");
        const eyeDropper = new EyeDropper();
        // Evento para la selección de color
        pickBtn.addEventListener("click", async () => {
            try {
                const colorValue = await eyeDropper.open();
                // Convertir colorValue.sRGBHex a minúsculas para asegurar un análisis correcto
                const hexValue = colorValue.sRGBHex.toLowerCase();
                const rgbValue = hexToRgb(hexValue);
                result.style.display = "grid";
                hexInput.value = hexValue;
                rgbInput.value = rgbValue;
                pickedColor.style.backgroundColor = hexValue;
            } catch {
                alert("¡Tu navegador no es compatible con la API Eyedropper!");
            }
        });
    } else {
        alert("¡Tu navegador no es compatible con la API Eyedropper!");
    }
};

// Evento para la entrada de archivo
fileInput.addEventListener("change", () => {
    result.style.display = "none";
    const reader = new FileReader();
    reader.onload = () => image.setAttribute("src", reader.result);
    reader.readAsDataURL(fileInput.files[0]);
});

// Función para copiar texto al portapapeles
const copyToClipboard = (textId) => {
    const textElement = document.getElementById(textId);
    textElement.select();
    document.execCommand("copy");
};

// Función de conversión RGB
const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
};

// Inicializar Eyedropper
window.onload = initEyeDropper;