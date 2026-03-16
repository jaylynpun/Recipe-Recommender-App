exports.handler = async function(event) {
    
    if(event.httpMethod !== "GET") {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Method not allowed" })
        }
    }
    const apiKey = process.env.SPOONACULAR_API_KEY;
    console.log("API KEY:", process.env.SPOONACULAR_API_KEY);
    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Missing api key" })
        }
    }

    const ingredient = event.queryStringParameters?.ingredients?.trim() || "chicken";

    try {
        const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(ingredient)}&addRecipeInformation=true&fillIngredients=true&number=12&apiKey=${apiKey}`;
        
        const resp = await fetch(url);
        const data = await resp.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data.results),
        }
    } catch (err) {
        return {
            statusCode: 500, 
            body: JSON.stringify({ error: err.message })
        };
    }      
};