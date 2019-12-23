import wiktionaryQuery from './wiktionary';

function formatWordDefinition(wikiWord: any, langcode: string) {
    let definitions = wikiWord[langcode][0].definitions;
    if (definitions.length < 2)
        return definitions[0].definition;
    return '<ul>' +
        definitions.map((x: any) => {
            return `<li>${x.definition}</li>`;
        }).join("")
        + '</ul>';
}

async function handleWordLookup(word: string, langcode: string) {
    return new Promise((resolve, reject) => {
        wiktionaryQuery(word).then(definition => {
            resolve(formatWordDefinition(definition, langcode));
        }).catch(error => {
            reject(Error(error.message));
        });
    });
}

export default handleWordLookup;
