// async function searchRecipes() {
//     const ingredient = document.getElementById("searchInput").value;

//     const resp = await fetch(
//         `/api/recipes?ingredients=${ingredient}`
//     );
//     const data = await resp.json();

//     displayRecipes(data);
// }
 
const API_KEY = "your-api-key-here";

const btn = document.getElementById("search-recipes-btn");

btn.addEventListener("click", async () => {
  const ingredient = document.getElementById("ingredient-input").value;

  await getRecipes(ingredient);
});

async function getRecipes(ingredient) {
    try {
        const resp = await fetch(`/api/recipes?ingredients=${ingredient}`);
        const data = await resp.json();
        console.log(data.results); 
        displayRecipes(data.results);
    } catch (err) {
        console.error(err);
    }
}

function displayRecipes(recipes) {
    const container = document.getElementById("recipe-container");

    container.innerHTML = "";

    recipes.forEach(recipe => {
        const ingredients = recipe.extendedIngredients
        ? recipe.extendedIngredients.map(i => i.name).join(", ")
        : "N/A";
        const diet = recipe.diets || [].join(", ") || "None";
        const card = `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <img src="${recipe.image}" class="card-img-top" alt="Recipe image">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text">
                            ${recipe.summary || "".replace(/<[^>]*>/g,"").slice(0,120)}...
                        </p>
                    </div>

                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <strong>Dietary restrictions:</strong> ${diet}
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

document.getElementById("search-recipes-btn").addEventListener("click", () => {
    const query = document.getElementById("search-bar").value.trim();
    if (query) {
        getRecipes(query);
    }
});

// getRecipes("chicken");