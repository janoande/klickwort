async function wiktionaryQuery(word) {
    word = word.replace(/\u00AD/g,''); // remove soft hyphens
    word = word.replace(/ /g, "_");
    let url = "https://en.wiktionary.org/api/rest_v1/page/definition/" + encodeURIComponent(word);
    try {
        const response = await fetch(url);
        if (!response.ok) throw response.status;
        const json = await response.json();
        if (json.error) throw json.error;
        return json;
    }
    catch (error) {
        console.error("Wiktionary error:", error);
    }
}

export default wiktionaryQuery;
