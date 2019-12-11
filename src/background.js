
"use strict";

var langs = require('langs');

browser.runtime.onMessage.addListener(handleWordLookup);

function handleWordLookup({ word, langcode }) {
    let language = (langs.where("1", langcode) || { name: "English"}).name;
    browser.tabs.create({
        url: "https://en.wiktionary.org/w/index.php?search=" + encodeURIComponent(word) + "#" + encodeURIComponent(language)
    });
}
