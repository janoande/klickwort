function formatWordDefinition(wikiWord: any, locale: string) {
    let definitions = wikiWord[locale][0].definitions;
    if (definitions.length < 2)
        return definitions[0].definition;
    return '<ul>' +
        definitions.map((x: any) => {
            return `<li>${x.definition}</li>`;
        }).join("")
        + '</ul>';
}

async function wiktionaryQuery(word: string, srcLocale: string) {
    word = word.replace(/\u00AD/g, ''); // remove soft hyphens
    word = word.replace(/ /g, "_");
    let url = "https://en.wiktionary.org/api/rest_v1/page/definition/" + encodeURIComponent(word);
    try {
        const response = await fetch(url);
        if (!response.ok) throw response.status;
        const json = await response.json();
        if (json.error) throw json.error;
        if (json[srcLocale] === undefined) throw new Error();
        return json;
    }
    catch (error) {
        throw new Error(`Definition not found for ${word}.`);
    }
}

async function wiktionaryQueryWordFormatted(word: string, locale: string) {
    return formatWordDefinition(await wiktionaryQuery(word, locale), locale);
}

export { wiktionaryQuery, wiktionaryQueryWordFormatted };
