import wiktionaryQuery from './wiktionary';

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

async function handleWordLookup(word: string, locale: string) {
    return new Promise((resolve, reject) => {
        wiktionaryQuery(word, locale).then(definition => {
            resolve(formatWordDefinition(definition, locale));
        }).catch(error => {
            reject(Error(error.message));
        });
    });
}

export default handleWordLookup;
