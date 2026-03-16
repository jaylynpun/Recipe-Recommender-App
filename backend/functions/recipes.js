export async function handler(event) {
    
    if(event.httpMethod !== "GET") {
        return json(405, { error: "Method not allowed" });
    }
    const apiKey = process.env.SPOONACULAR_API_KEY;
    if (!apiKey) {
        return json(500, { error: "Missing api key" });
    }

    const ingredient = event.queryStringParameters?.ingredients?.trim() || "chicken";

    try {
        const url = `https://api.spoonacular.com/recipes/complexSearch?addRecipeInformation=true&fillIngredients=true&number=12${ingredient ? `&includeIngredients=${encodeURIComponent(ingredient)}` : ""}&apiKey=${apiKey}`;
        
        const resp = await fetch(url);
        const data = await resp.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data.results),
        };
    } catch (err) {
        return {
            statusCode: 500, 
            body: JSON.stringify({ error: err.message })
        };
    }      
};