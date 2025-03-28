const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const mealList = document.getElementById('mealList');
const modalContainer = document.querySelector('.modal-container');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipeCloseBtn');

// Mapa de traducción español-inglés
const ingredientTranslations = {
    'pollo': 'chicken',
    'carne': 'beef',
    'pescado': 'fish',
    'arroz': 'rice',
    'papa': 'potato',
    'papas': 'potato',
    'tomate': 'tomato',
    'zanahoria': 'carrot',
    'cebolla': 'onion',
    'ajo': 'garlic',
    'huevo': 'egg',
    'leche': 'milk',
    'queso': 'cheese',
    'pasta': 'pasta',
    'frijoles': 'beans',
    'cerdo': 'pork',
    'maiz': 'corn',
    'maíz': 'corn'
};

// Función para traducir ingrediente de español a inglés
function translateIngredient(spanishIngredient) {
    const lowerIngredient = spanishIngredient.toLowerCase();
    return ingredientTranslations[lowerIngredient] || spanishIngredient;
}

// Eventos
searchButton.addEventListener('click', async () => {
    const ingredient = searchInput.value.trim();
    if (ingredient) {
        const meals = await searchMealsByIngredient(ingredient);
        displayMeals(meals);
    }
});

mealList.addEventListener('click', async (e) => {
    const card = e.target.closest('.meal-item');
    if (card) {
        const mealId = card.dataset.id;
        const meal = await getMealDetails(mealId);
        if (meal) {
            showMealDetailsPopup(meal);
        }
    }
});

// Función para buscar comidas por ingrediente
async function searchMealsByIngredient(ingredient) {
    try {
        const translatedIngredient = translateIngredient(ingredient);
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${translatedIngredient}`);
        const data = await response.json();
        return data.meals;
    } catch (error) {
        // Mostrar error en consola
        console.error('Error al obtener datos:', error);
    }
}

// Función para obtener detalles de la comida por ID
async function getMealDetails(mealId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        return data.meals[0];
    } catch (error) {
        console.error('Error al obtener detalles de la comida:', error);
    }
}

// Función para mostrar comidas en la lista
function displayMeals(meals) {
    mealList.innerHTML = '';
    if (meals) {
        meals.forEach((meal) => {
            const mealItem = document.createElement('div');
            mealItem.classList.add('meal-item');
            mealItem.dataset.id = meal.idMeal;
            mealItem.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
            `;
            mealList.appendChild(mealItem);
        });
    } else {
        mealList.innerHTML = '<p>No se encontraron comidas. Intenta con otro ingrediente.</p>';
    }
}

// Función para crear y mostrar detalles de la comida en el popup
function showMealDetailsPopup(meal) {
    mealDetailsContent.innerHTML = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instrucciones:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="recipe-video">
            <a href="${meal.strYoutube}" target="_blank">Tutorial en Video</a>
        </div>
    `;
    modalContainer.style.display = 'block';
}

// Evento para el botón de cerrar popup
recipeCloseBtn.addEventListener('click', closeRecipeModal);

function closeRecipeModal() {
    modalContainer.style.display = 'none';
}

searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

async function performSearch() {
    const ingredient = searchInput.value.trim();
    if (ingredient) {
        const meals = await searchMealsByIngredient(ingredient);
        displayMeals(meals);
    }
}

// Realizar una búsqueda de pollo al cargar la página
window.addEventListener('load', () => {
    searchInput.value = 'pollo';
    performSearch();
});