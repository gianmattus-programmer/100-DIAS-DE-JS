const etiquetasSelect = document.querySelectorAll('select');

etiquetasSelect.forEach((etiqueta, id) => {
    for (let codigo_pais in countries) {
        let seleccionado = id === 0 ? (codigo_pais === "en" ? "selected" : "") : (codigo_pais === "es" ? "selected" : "");

        let opcion = `<option ${seleccionado} value="${codigo_pais}">${countries[codigo_pais]}</option>`;
        etiqueta.insertAdjacentHTML("beforeend", opcion);
    }
});

document.getElementById('translateBtn').addEventListener('click', function () {
    const texto = document.getElementById('inputText').value;
    const traducirDe = document.getElementById('translateFrom').value;
    const traducirA = document.getElementById('translateTo').value;
    traducirTexto(texto, traducirDe, traducirA);
});

function traducirTexto(textoEntrada, idiomaOrigen, idiomaDestino) {
    const urlApi = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textoEntrada)}&langpair=${idiomaOrigen}|${idiomaDestino}`;

    fetch(urlApi).then(respuesta => respuesta.json()).then(datos => {
        if (datos.responseData) {
            const textoTraducido = datos.responseData.translatedText;
            const textoFormateado = eliminarSignosInterrogacion(textoTraducido);
            document.getElementById('outputText').innerText = textoFormateado;
        } else {
            document.getElementById('outputText').innerText = "Error: ¡No se pudo traducir!";
        }
    }).catch(error => {
        console.error('Error:', error);
        document.getElementById('outputText').innerText = "Error: ¡Ocurrió un error durante la traducción!";
    });
}

function eliminarSignosInterrogacion(texto) {
    return texto.replace(/^¿+|¿+$/g, '');
}

function reproducirTexto(texto) {
    const sintesisVoz = window.speechSynthesis;
    const expresionVoz = new SpeechSynthesisUtterance(texto);
    expresionVoz.lang = document.getElementById('translateTo').value;

    sintesisVoz.speak(expresionVoz);
}

document.getElementById('speakBtn').addEventListener('click', function () {
    const textoTraducido = document.getElementById('outputText').innerText;
    reproducirTexto(textoTraducido);
});