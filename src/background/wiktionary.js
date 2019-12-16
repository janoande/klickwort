async function wiktionaryQuery(word, srcLang, dstLang) {
    let url = new URL(`https://${srcLang}.wiktionary.org`);
    url.pathname = "w/api.php";
    url.searchParams.set("action", "query");
    url.searchParams.set("prop", "extracts");
    url.searchParams.set("format", "json");
    url.searchParams.set("exlimit", "1");
    url.searchParams.set("titles", word);
    try {
        const response = await fetch(url.href);
        const json = await response.json();
        if (json.error)
            throw json.error;
        // TODO: extract destination language
        return Object.values(json.query.pages)[0].extract;
    }
    catch (error) {
        console.error("Error:", error);
    }
}

export default wiktionaryQuery;
