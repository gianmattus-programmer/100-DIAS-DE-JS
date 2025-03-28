const imagen = document.getElementById('cover'),
    titulo = document.getElementById('music-title'),
    artista = document.getElementById('music-artist'),
    tiempoActualEl = document.getElementById('current-time'),
    duracionEl = document.getElementById('duration'),
    progreso = document.getElementById('progress'),
    progresoReproductor = document.getElementById('player-progress'),
    btnAnterior = document.getElementById('prev'),
    btnSiguiente = document.getElementById('next'),
    btnReproducir = document.getElementById('play'),
    fondo = document.getElementById('bg-img');

const musica = new Audio();

const songs = [
    {
        path: 'assets/1.mp3',
        displayName: 'The Charmer\'s Call',
        cover: 'assets/1.jpg',
        artist: 'Hanu Dixit',
    },
    {
        path: 'assets/2.mp3',
        displayName: 'You Will Never See Me Coming',
        cover: 'assets/2.jpg',
        artist: 'NEFFEX',
    },
    {
        path: 'assets/3.mp3',
        displayName: 'Intellect',
        cover: 'assets/3.jpg',
        artist: 'Yung Logos',
    }
];

let indiceMusica = 0;
let estaReproduciendo = false;

function alternarReproduccion() {
    if (estaReproduciendo) {
        pausarMusica();
    } else {
        reproducirMusica();
    }
}

function reproducirMusica() {
    estaReproduciendo = true;
    // Cambiar icono del botón reproducir
    btnReproducir.classList.replace('fa-play', 'fa-pause');
    // Establecer título del botón al pasar el mouse
    btnReproducir.setAttribute('title', 'Pausar');
    musica.play();
}

function pausarMusica() {
    estaReproduciendo = false;
    // Cambiar icono del botón pausar
    btnReproducir.classList.replace('fa-pause', 'fa-play');
    // Establecer título del botón al pasar el mouse
    btnReproducir.setAttribute('title', 'Reproducir');
    musica.pause();
}

function cargarMusica(cancion) {
    musica.src = cancion.path;
    titulo.textContent = cancion.displayName;
    artista.textContent = cancion.artist;
    imagen.src = cancion.cover;
    fondo.src = cancion.cover;
}

function cambiarMusica(direccion) {
    indiceMusica = (indiceMusica + direccion + songs.length) % songs.length;
    cargarMusica(songs[indiceMusica]);
    reproducirMusica();
}

function actualizarBarraProgreso() {
    const { duration, currentTime } = musica;
    const porcentajeProgreso = (currentTime / duration) * 100;
    progreso.style.width = `${porcentajeProgreso}%`;

    const formatearTiempo = (tiempo) => String(Math.floor(tiempo)).padStart(2, '0');
    duracionEl.textContent = `${formatearTiempo(duration / 60)}:${formatearTiempo(duration % 60)}`;
    tiempoActualEl.textContent = `${formatearTiempo(currentTime / 60)}:${formatearTiempo(currentTime % 60)}`;
}

function establecerBarraProgreso(e) {
    const ancho = progresoReproductor.clientWidth;
    const clickX = e.offsetX;
    musica.currentTime = (clickX / ancho) * musica.duration;
}

btnReproducir.addEventListener('click', alternarReproduccion);
btnAnterior.addEventListener('click', () => cambiarMusica(-1));
btnSiguiente.addEventListener('click', () => cambiarMusica(1));
musica.addEventListener('ended', () => cambiarMusica(1));
musica.addEventListener('timeupdate', actualizarBarraProgreso);
progresoReproductor.addEventListener('click', establecerBarraProgreso);

cargarMusica(songs[indiceMusica]);