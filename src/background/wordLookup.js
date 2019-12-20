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
    let wordDefinition = await wiktionaryQuery(word);
    if (!wordDefinition || !wordDefinition[langcode] || wordDefinition.detail === "Page or revision not found.") {
        throw new Error(`Definition not found for "${word}".`);
    }
    return formatWordDefinition(wordDefinition, langcode);
}

export default handleWordLookup;
