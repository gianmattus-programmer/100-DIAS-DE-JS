const timerRef = document.querySelector(".current-time");
const hourInput = document.getElementById("hour-input");
const minuteInput = document.getElementById("minute-input");
const activeAlarms = document.querySelector(".alarms-list");
const setAlarm = document.getElementById("set");
const clearAllButton = document.querySelector(".clear");
const alarmSound = new Audio("./alarm.mp3");

let alarmIndex = 0;
let alarmsArray = [];
let initialHour = 0;
let initialMinute = 0;

// Función auxiliar para agregar un cero inicial a valores de un solo dígito
const appendZero = (value) => (value < 10 ? "0" + value : value);

// Función para mostrar la hora y activar alarmas
const displayTimer = () => {
    const date = new Date();
    const currentTime = date.toLocaleTimeString("en-US", { hour12: false });
    timerRef.textContent = currentTime;

    // Verificar si es hora de activar las alarmas
    alarmsArray.forEach((alarm) => {
        if (alarm.isActive && alarm.time === currentTime.slice(0, 5)) {
            alarmSound.play();
        }
    });
};

// Función para crear una nueva alarma
const createAlarm = (hour, minute) => {
    alarmIndex += 1;

    // Crear un objeto de alarma
    const alarmObj = {
        id: `${alarmIndex}_${hour}_${minute}`,
        time: `${appendZero(hour)}:${appendZero(minute)}`,
        isActive: false
    };

    // Agregar alarma al array y crear su representación en la UI
    alarmsArray.push(alarmObj);
    const alarmDiv = document.createElement("div");
    alarmDiv.className = "alarm";
    alarmDiv.dataset.id = alarmObj.id;
    alarmDiv.innerHTML = `<span>${alarmObj.time}</span>`;

    // Crear una casilla de verificación para activar/desactivar la alarma
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () => toggleAlarm(alarmObj));
    alarmDiv.appendChild(checkbox);

    // Crear un botón de eliminar para la alarma
    const deleteButton = document.createElement("button");
    // Fontawesome
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.className = "deleteButton";
    deleteButton.addEventListener("click", () => deleteAlarm(alarmObj));
    alarmDiv.appendChild(deleteButton);

    // Agregar la UI de la alarma a la lista de alarmas activas
    activeAlarms.appendChild(alarmDiv);
};

// Función para alternar el estado activo de la alarma
const toggleAlarm = (alarm) => {
    alarm.isActive = !alarm.isActive;
    if (alarm.isActive) {
        const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false }).slice(0, 5);
        if (alarm.time === currentTime) {
            alarmSound.play();
        }
    } else {
        alarmSound.pause();
    }
};

// Función para eliminar una alarma
const deleteAlarm = (alarm) => {
    const index = alarmsArray.indexOf(alarm);
    if (index > -1) {
        alarmsArray.splice(index, 1);
        document.querySelector(`[data-id="${alarm.id}"]`).remove();
    }
};

// Evento para limpiar todas las alarmas
clearAllButton.addEventListener("click", () => {
    alarmsArray = [];
    activeAlarms.innerHTML = "";
});

// Evento para configurar una nueva alarma
setAlarm.addEventListener("click", () => {
    // Analizar los valores de entrada, por defecto 0 si está vacío o no es un número
    let hour = parseInt(hourInput.value) || 0;
    let minute = parseInt(minuteInput.value) || 0;

    // Validar los valores de entrada
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        alert("¡Hora o minuto inválido. Por favor, ingrese valores dentro del rango válido!");
        return;
    }

    // Verificar si ya existe una alarma con la misma hora
    if (!alarmsArray.some(alarm => alarm.time === `${appendZero(hour)}:${appendZero(minute)}`)) {
        createAlarm(hour, minute);
    }

    // Limpiar campos de entrada
    [hourInput.value, minuteInput.value] = ["", ""];
});

// Inicializar el temporizador y los campos de entrada
window.onload = () => {
    setInterval(displayTimer, 1000);
    [hourInput.value, minuteInput.value] = ["", ""];
};