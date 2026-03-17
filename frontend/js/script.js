async function getRecipes(ingredient = "") {
    try {
        const resp = await fetch(`/api/recipes?ingredients=${encodeURIComponent(ingredient)}`);
        const recipes = await resp.json();
        console.log(recipes); 
        displayRecipes(recipes);
    } catch (err) {
        console.error(err);
    }
}

function displayRecipes(recipes) {
    const container = document.getElementById("recipe-container");

    if (!Array.isArray(recipes)) {
        container.innerHTML = "<p>Error loading recipes.</p>";
        console.error(recipes);
        return;
    }

    if(recipes.length === 0) {
        container.innerHTML = "<p>No recipes found</p>";
        return;
    }

    container.innerHTML = "";

    recipes.forEach(recipe => {

        const ingredients = recipe.extendedIngredients
        ? recipe.extendedIngredients.map(i => i.name).join(", ")
        : "N/A";

        const diets = recipe.diets && recipe.diets.length > 0 
        ? recipe.diets.join(", ")
        : "None";

        const summary = recipe.summary
        ? recipe.summary.replace(/<[^>]*>/g,"").slice(0,120)
        : "";

        const card = `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <img src="${recipe.image}" class="card-img-top" alt="Recipe image">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text">
                            ${summary}...
                        </p> 
                    </div>

                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <strong>Dietary restrictions:</strong> ${diets}
                        </li>
                        <li class="list-group-item">
                            <strong>Ingredients:</strong> ${ingredients}
                        </li>
                    </ul>

                    <div class="card-body">
                        <a href="${recipe.sourceUrl}" target="_blank" class="btn btn-primary">
                            View Recipe
                        </a>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML += card;
    });
}

const filterBtn = document.getElementById("filter-btn");
const filterDropdown = document.getElementById("filter-dropdown");
const save = document.getElementById("save-btn");

filterBtn.addEventListener("click", () => {
    filterDropdown.style.display = filterDropdown.style.display === "none" ? "flex" : "none";
});

save.addEventListener("click", () => {
    const selectedIngredients = Array.from(document.querySelectorAll("#ingr-list .filter-option.selected")).map(el => el.dataset.value);
    const selectedDiets = Array.from(document.querySelectorAll("#diet-list .filter-option.selected")).map(el => el.dataset.value);
    getRecipesWithFilters({ ingredients: selectedIngredients, diets: selectedDiets });
    filterDropdown.style.display = "none";
});

// filter menu - ingredients listeners
const ingrBtn = document.getElementById("ingr-dropdown-btn");
const ingrList = document.getElementById("ingr-list");

ingrBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    ingrList.style.display = ingrList.style.display === "none" ? "block" : "none";
});

ingrList.querySelectorAll(".filter-option").forEach(li => {
    li.addEventListener("click", () => li.classList.toggle("selected"));
});

// filter menu - diets listeners
// hopefully this doesnt break anything cause I cant see it anymore since the Ive reached the api call limit yet again
const dietsBtn = document.getElementById("diet-dropdown-btn");
const dietsList = document.getElementById("diet-list");

dietsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dietsList.style.display = dietsList.style.display === "none" ? "block" : "none";
});

dietsList.querySelectorAll(".filter-option").forEach(li => {
    li.addEventListener("click", () => li.classList.toggle("selected"));
});

window.addEventListener("click", (e) => {
    if(!filterDropdown.contains(e.target) && !filterBtn.contains(e.target)) {
        filterDropdown.style.display = "none";
        displayRecipes(ingredient);
    }
});

// search recipes using search bar
document.getElementById("search-recipes-btn").addEventListener("click", () => {
    const query = document.getElementById("search-bar").value.trim();
    if (query) {
        getRecipes(query);
    }
});


getRecipes();
