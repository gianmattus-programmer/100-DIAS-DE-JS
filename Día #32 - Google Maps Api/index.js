// Configurar mapa
function inicializar() {
    var opcionesMapa = {
        // Zoom del mapa al inicio
        zoom: 12,
        // Coordenadas iniciales del centro al inicio (Lima, Perú)
        center: new google.maps.LatLng(-12.0464, -77.0428),
        // Tipo de mapa (ROADMAP, SATELLITE, HYBRID, TERRAIN)
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        // Zoom mínimo del mapa
        minZoom: 2
    };

    // Crear una nueva instancia del mapa usando las opciones proporcionadas
    var mapa = new google.maps.Map(document.getElementById('map'), opcionesMapa);

    // Crear una ventana de información para mostrar detalles de la ubicación
    var ventanaInfo = new google.maps.InfoWindow();

    // Crear un marcador para Lima, Perú
    var marcador = new google.maps.Marker({
        // Coordenadas para Lima, Perú
        position: new google.maps.LatLng(-12.0464, -77.0428),
        // Adjuntar el marcador
        map: mapa,
        // Texto emergente al pasar el mouse
        title: 'Lima, Perú'
    });

    // Agregar un escuchador de eventos de clic para el marcador
    marcador.addListener('click', function () {
        ventanaInfo.setContent(marcador.title);
        ventanaInfo.open(mapa, marcador);
    });

    // Ajustar el centro del mapa cuando se redimensiona la ventana
    google.maps.event.addDomListener(window, "resize", function () {
        mapa.setCenter(opcionesMapa.center);
    });
}

// Inicializar el mapa cuando termine de cargar la ventana
google.maps.event.addDomListener(window, 'load', inicializar);