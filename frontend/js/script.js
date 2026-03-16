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

        if(recipes.length === 0) {
            container.innerHTML = "<p>No recipes found</p>";
            return;
        }
    });
}

document.getElementById("search-recipes-btn").addEventListener("click", () => {
    const query = document.getElementById("search-bar").value.trim();
    if (query) {
        getRecipes(query);
    }
});


getRecipes();
