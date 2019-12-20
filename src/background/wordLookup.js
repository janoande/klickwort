import wiktionaryQuery from './wiktionary.js';

function formatWordDefinition(wikiWord, langcode) {
    let definitions = wikiWord[langcode][0].definitions;
    if (definitions.length < 2)
        return definitions[0].definition;
    return '<ul>' +
        definitions.map(x => {
            return `<li>${x.definition}</li>`;
        }).join("")
        + '</ul>';
}

async function handleWordLookup(word, langcode) {
    return new Promise((resolve, reject) => {
        wiktionaryQuery(word).then(definition => {
            resolve(formatWordDefinition(definition, langcode));
        }).catch(error => {
            reject(Error(error.message));
        });
    });
}

export default handleWordLookup;
