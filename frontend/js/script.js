// async function searchRecipes() {
//     const ingredient = document.getElementById("searchInput").value;

//     const resp = await fetch(
//         `/api/recipes?ingredients=${ingredient}`
//     );
//     const data = await resp.json();

//     displayRecipes(data);
// }
 
const API_KEY = "8f0e0114cb824717b30d1a33e1e88fbd"; 

async function getRecipes(ingredient) {
    try {
        const resp = await fetch(
            `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient}&apiKey=${API_KEY}`
        );
        const data = await resp.json();
        console.log(data); 
        displayRecipes(data)
    } catch (err) {
        console.error(err);
    }
}

function displayRecipes(recipes) {
    const container = document.getElementById("recipe-container");

    container.innerHTML = "";

    recipes.forEach(recipe => {
        const ingredients = recipe.usedIngredients.map(i => i.name).join(", ");
        const diet = recipe.diet.join(", ") || "None";
        const card = `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <img src="${recipe.image}" class="card-img-top" alt="Recipe image">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text">
                            ${recipe.summary.replace(/<[^>]*>/g,"").slice(0,120)}...
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