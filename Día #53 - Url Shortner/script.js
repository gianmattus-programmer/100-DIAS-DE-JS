const botonAcortar = document.getElementById('short-btn');
const botonRecargar = document.getElementById('reload-btn');

botonAcortar.addEventListener('click', acortarUrl);

function acortarUrl() {
    var urlOriginal = document.getElementById("originalUrl").value;
    var urlApi = "https://tinyurl.com/api-create.php?url=" + encodeURIComponent(urlOriginal);
    areaUrlAcortada = document.getElementById("shortenedUrl");

    fetch(urlApi).then(respuesta => respuesta.text()).then(datos => {
        areaUrlAcortada.value = datos;
    }).catch(error => {
        areaUrlAcortada.value = "Error: ¡No se pudo acortar la URL!";
    });
}

botonRecargar.addEventListener('click', () => {
    location.reload();
});