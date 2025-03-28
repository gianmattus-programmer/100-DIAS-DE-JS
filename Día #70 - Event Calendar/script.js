// Función para llamar a generar calendario al cargar
window.onload = function () {
    generateCalendar();
};

// Función para generar el calendario
function generateCalendar() {
    const calendar = document.getElementById('calendar');

    // Crear un nuevo objeto Date para obtener la fecha, mes y año actuales
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // Calcular el primer y último día del mes
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Calcular el día de la semana del primer día del mes
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    // Agregar elementos div vacíos para los días antes del primer día del mes
    for (let i = 0; i < firstDayOfWeek; i++) {
        let blankDay = document.createElement("div");
        calendar.appendChild(blankDay);
    }

    // Agregar elementos div para cada día del mes
    for (let day = 1; day <= totalDays; day++) {
        let daySquare = document.createElement("div");
        daySquare.className = "calendar-day";
        daySquare.textContent = day;
        daySquare.id = `day-${day}`;
        calendar.appendChild(daySquare);
    }
}

// Función para mostrar el modal de agregar tarea
function showAddTaskModal() {
    document.getElementById('addTaskModal').style.display = 'block';
}

// Función para cerrar el modal de agregar tarea
function closeAddTaskModal() {
    document.getElementById('addTaskModal').style.display = 'none';
}

// Función para eliminar una tarea
function deleteTask(taskElement) {
    // Diálogo de confirmación para confirmar la eliminación
    if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
        // Si el usuario confirma, eliminar el elemento de tarea de su padre
        taskElement.parentNode.removeChild(taskElement);
    }
}

// Función para editar una tarea
function editTask(taskElement) {
    // Solicitar al usuario que edite la descripción de la tarea, con la descripción actual como predeterminada
    const newTaskDesc = prompt("Edita tu tarea:", taskElement.textContent);
    // Verificar si el usuario ingresó una nueva descripción de tarea y no está vacía
    if (newTaskDesc !== null & newTaskDesc.trim() !== "") {
        // Actualizar el contenido de texto del elemento de tarea con la nueva descripción
        taskElement.textContent = newTaskDesc;
    }
}

// Función para agregar una tarea
function addTask() {
    // Obtener fecha y descripción de la tarea desde los campos de entrada
    const taskDate = new Date(document.getElementById('task-date').value);
    const taskDesc = document.getElementById('task-desc').value.trim();

    // Validar fecha y descripción de la tarea
    if (taskDesc && !isNaN(taskDate.getDate())) {
        // Obtener los días del calendario
        const calendarDays = document.getElementById('calendar').children;
        // Iterar a través de los días del calendario
        for (let i = 0; i < calendarDays.length; i++) {
            const day = calendarDays[i];
            // Comprobar si el día coincide con la fecha de la tarea
            if (parseInt(day.textContent) === taskDate.getDate()) {
                // Crear elemento de tarea
                const taskElement = document.createElement("div");
                taskElement.className = "task";
                taskElement.textContent = taskDesc;

                // Agregar evento para clic derecho para eliminar tarea
                taskElement.addEventListener("contextmenu", function (event) {
                    event.preventDefault(); // Prevenir menú contextual predeterminado
                    deleteTask(taskElement); // Llamar función deleteTask
                });

                // Agregar evento para clic normal para editar tarea
                taskElement.addEventListener('click', function () {
                    editTask(taskElement); // Llamar función editTask
                });

                // Añadir elemento de tarea al elemento día
                day.appendChild(taskElement);
                break;
            }
        }
        closeAddTaskModal(); // Cerrar modal de agregar tarea
    } else {
        // Alerta si la fecha o descripción de la tarea no son válidas
        alert("¡Por favor ingrese una fecha y descripción de tarea válidas!");
    }
}