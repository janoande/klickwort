async function wiktionaryQuery(word, srcLang, dstLang) {
    let url = "https://en.wiktionary.org/api/rest_v1/page/definition/" + encodeURIComponent(word);
    try {
        const response = await fetch(url);
        const json = await response.json();
        if (json.error)
            throw json.error;
        return json;
    }
    catch (error) {
        console.error("Error:", error);
    }
}

export default wiktionaryQuery;
