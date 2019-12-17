import wiktionaryQuery from './wiktionary.js';

function formatWordDefinition(wikiWord, langcode) {
    return wikiWord[langcode][0].definitions.map(x => x.definition).join("<br/>");
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
