export async function handler(event) {
    try {
        if(event.httpMethod !== "GET") {
            return json(405, { error: "Method not allowed" });
        }
        const apiKey = process.env.SPOONACULAR_API_KEY;
        if (!apiKey) {
            return json(500, { error: "Missing api key" });
        }

        const params = event.queryStringParameters || {};
        const ingredients = (params.ingredients || "chicken").trim();
        const diet = (params.diet || "").trim();

        if (!ingredients) {
            return json(400, { error: "Please provide at least one ingredient" });
        }

        const sp = new URL("https://api.spoonacular.com/recipes/complexSearch");
        sp.searchParams.set("apiKey", apiKey);
        sp.searchParams.set("includeIngredients", ingredients);
        sp.searchParams.set("addRecipeInformation", "true");
        sp.searchParams.set("fillIngredients", "true");

        if(diet) {
            sp.searchParams.set("diet", diet);
        }

        const resp = await fetch(sp.toString(), {
            method: "GET",
            headers: { Accept: "application/json" },
        });

        if (!resp.ok) {
            const text = await resp.text();
            return json(resp.status, {
                error: "Upstream API error",
                details: text.slice(0, 300),
            });
        } 
        const data = await resp.json();
            
        const results = Array.isArray(data.results)
            ? data.results.map((r) => ({
                id: r.id,
                title: r.title,
                image: r.image,
                sourceUrl: r.sourceUrl || null,
                summary: r.summary || "",
                diet: r.diet || [],
                ingredients: r.extendedIngredients?.map(i => i.original) || []
            }))
            : [];
        return json(200, { results });
    } catch (error) {
        return json(500, { error: "Unexpected server error", details: String(error?.message || error) }); 
    }
};

function json(statusCode, body) {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
        },
        body: JSON.stringify(body),
    };
}

