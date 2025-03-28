document.getElementById('screenshotBtn').addEventListener('click', function () {
    // Ocultar el botón de captura de pantalla de la imagen capturada
    this.classList.add('hidden');

    // Tomar la captura de pantalla
    html2canvas(document.documentElement, {
        scale: window.devicePixelRatio, // Capturar con la relación de píxeles del dispositivo
        logging: true, // Habilitar registro para depuración
        useCORS: true, // Usar CORS para manejar imágenes de origen cruzado
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
    }).then(canvas => {
        // Crear una imagen
        var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

        // Crear un enlace para descargar la imagen
        var link = document.createElement('a');
        link.download = 'screenshot.png';
        link.href = image;
        link.click();

        // Mostrar el botón nuevamente
        this.classList.remove('hidden');
    });

});