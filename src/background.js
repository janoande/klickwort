"use strict";

const langs = require('langs');

browser.runtime.onMessage.addListener(handleWordLookup);

function handleWordLookup({ word, langcode }) {
    const language = (langs.where("1", langcode) || { name: "English"}).name;
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        const curTabIndex = tabs[0].index;
        browser.tabs.create({
            url: "https://en.wiktionary.org/w/index.php?search=" + encodeURIComponent(word) + "#" + encodeURIComponent(language),
            index: curTabIndex + 1
        });
    });
}

// context menu for translating selected text

browser.contextMenus.create({
    id: "google-trans-selection",
    title: "Translate with Google Translate",
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "deepl-trans-selection",
    title: "Translate with DeepL",
    contexts: ["selection"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "google-trans-selection":
            browser.tabs.create({
                url: "https://translate.google.se/#view=home&op=translate&sl=auto&tl=en&text=" + encodeURIComponent(info.selectionText),
                index: tab.index + 1
            });
        break;
        case "deepl-trans-selection":
            browser.tabs.create({
                url: "https://www.deepl.com/translator#auto/en/" + encodeURIComponent(info.selectionText),
                index: tab.index + 1
            });
        break;
        }
});
