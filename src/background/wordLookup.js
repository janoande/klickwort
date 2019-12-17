const langs = require('langs');
import wiktionaryQuery from './wiktionary.js';

function formatWordDefinition(wikiWord, langcode) {
    return wikiWord[langcode][0].definitions.map(x => x.definition).join("<br/>");
}

async function handleWordLookup(word, langcode) {
    /* const language = (langs.where("1", langcode) || { name: "English"}).name;
     * browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
     *     const curTabIndex = tabs[0].index;
     *     browser.tabs.create({
     *         url: "https://en.wiktionary.org/w/index.php?search=" + encodeURIComponent(word) + "#" + encodeURIComponent(language),
     *         index: curTabIndex + 1
     *     });
     * }); */
    let wordDefinition = await wiktionaryQuery(word);
    if (!wordDefinition || wordDefinition.detail === "Page or revision not found.") {
        return null;
    }
    return formatWordDefinition(wordDefinition, langcode);
}

export default handleWordLookup;
