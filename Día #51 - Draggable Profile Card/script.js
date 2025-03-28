const card = document.querySelector('#card');
const cardHeader = card.querySelector('header');
const resetBtn = document.querySelector('.reset');

// Inicializar una variable para rastrear si el botón del mouse está presionado
let clicked = false;

// Almacenar la posición inicial de la tarjeta
let startTop = card.offsetTop;
let startLeft = card.offsetLeft;

// Variables para almacenar el desplazamiento entre la posición del clic del mouse y la posición de la tarjeta
let offsetX, offsetY;

// Agregar un evento de escucha al encabezado de la tarjeta para el evento mousedown
cardHeader.addEventListener('mousedown', (e) => {
    // Establecer la variable 'clicked' en true cuando se presiona el botón del mouse
    clicked = true;

    // Calcular el desplazamiento entre la posición del clic del mouse y la posición de la tarjeta
    offsetX = e.clientX - card.offsetLeft;
    offsetY = e.clientY - card.offsetTop;
});

// Agregar un evento de escucha al documento entero para el evento mouseup
document.addEventListener('mouseup', () => {
    // Establecer la variable 'clicked' en false cuando se suelta el botón del mouse
    clicked = false;
});

// Agregar un evento de escucha al documento para el evento mousemove
document.addEventListener('mousemove', (e) => {
    // Verificar si el botón del mouse no está presionado, y si es así, salir de la función
    if (!clicked) return;

    // Actualizar la posición de la tarjeta basada en la posición actual del mouse y el desplazamiento
    const { clientX, clientY } = e;
    card.style.left = `${clientX - offsetX}px`;
    card.style.top = `${clientY - offsetY}px`;
});

// Función para restablecer la posición de la tarjeta a su estado inicial
function resetPosition() {
    card.style.left = `${startLeft}px`;
    card.style.top = `${startTop}px`;
}

// Agregar un evento de clic al botón de reinicio para llamar a la función 'resetPosition'
resetBtn.addEventListener('click', resetPosition);