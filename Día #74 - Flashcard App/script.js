// Seleccionando elementos del DOM
const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");

// Inicializando variables
let editBool = false;
let originalId = null;
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];

addQuestion.addEventListener("click", () => {
  // Mostrar la tarjeta para agregar pregunta y ocultar el contenedor
  container.classList.add("hide");
  question.value = "";
  answer.value = "";
  addQuestionCard.classList.remove("hide");
});

closeBtn.addEventListener("click", () => {
  // Cerrar la tarjeta de pregunta y mostrar el contenedor
  container.classList.remove("hide");
  addQuestionCard.classList.add("hide");
  if (editBool) {
    editBool = false;
  }
});

cardButton.addEventListener("click", () => {
  // Guardar la tarjeta
  let tempQuestion = question.value.trim();
  let tempAnswer = answer.value.trim();
  if (!tempQuestion || !tempAnswer) {
    // Mostrar mensaje de error si la pregunta o respuesta está vacía
    errorMessage.classList.remove("hide");
  } else {
    if (editBool) {
      // Si se está editando una tarjeta existente, eliminar la tarjeta original del array
      flashcards = flashcards.filter(flashcard => flashcard.id !== originalId);
    }
    let id = Date.now();
    // Agregar la nueva tarjeta al array
    flashcards.push({ id, question: tempQuestion, answer: tempAnswer });
    // Guardar el array de tarjetas en el almacenamiento local
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    container.classList.remove("hide");
    errorMessage.classList.add("hide");
    viewlist();
    question.value = "";
    answer.value = "";
    editBool = false;
    addQuestionCard.classList.add("hide"); // Esta línea oculta el modal después de agregar la tarjeta
  }
});

// Función para mostrar la lista de tarjetas
function viewlist() {
  const listCard = document.querySelector(".card-list-container");
  listCard.innerHTML = '';
  flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
  flashcards.forEach(flashcard => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <p class="question-div">${flashcard.question}</p>
      <p class="answer-div hide">${flashcard.answer}</p>
      <a href="#" class="show-hide-btn">Show/Hide</a>
      <div class="buttons-con">
        <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="delete"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    `;
    div.setAttribute('data-id', flashcard.id);
    const displayAnswer = div.querySelector(".answer-div");
    const showHideBtn = div.querySelector(".show-hide-btn");
    const editButton = div.querySelector(".edit");
    const deleteButton = div.querySelector(".delete");

    showHideBtn.addEventListener("click", () => {
      // Alternar la visibilidad de la respuesta
      displayAnswer.classList.toggle("hide");
    });

    editButton.addEventListener("click", () => {
      // Habilitar el modo de edición y mostrar la tarjeta para agregar pregunta
      editBool = true;
      modifyElement(editButton, true);
      addQuestionCard.classList.remove("hide");
    });

    deleteButton.addEventListener("click", () => {
      // Eliminar la tarjeta
      modifyElement(deleteButton);
    });

    listCard.appendChild(div);
  });
}

// Función para modificar un elemento de la tarjeta
const modifyElement = (element, edit = false) => {
  const parentDiv = element.parentElement.parentElement;
  const id = Number(parentDiv.getAttribute('data-id'));
  const parentQuestion = parentDiv.querySelector(".question-div").innerText;
  if (edit) {
    const parentAns = parentDiv.querySelector(".answer-div").innerText;
    answer.value = parentAns;
    question.value = parentQuestion;
    originalId = id;
    disableButtons(true);
  } else {
    // Eliminar la tarjeta del array y actualizar el almacenamiento local
    flashcards = flashcards.filter(flashcard => flashcard.id !== id);
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }
  parentDiv.remove();
};

// Función para deshabilitar botones de edición
const disableButtons = (value) => {
  const editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = value;
  });
};

// Evento para mostrar la lista de tarjetas cuando el DOM está cargado
document.addEventListener("DOMContentLoaded", viewlist);