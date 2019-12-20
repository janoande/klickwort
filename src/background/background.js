"use strict";

import handleWordLookup from './wordLookup.js';
import handleSelectionLookup from './selectionLookup.js';
import { Anki, AnkiBasicCard } from './anki.js';

browser.contextMenus.onClicked.addListener(handleSelectionLookup);

browser.runtime.onMessage.addListener((message , sender, sendResponse) => {
    if (message.action === "lookup-word") {
        handleWordLookup(message.word, message.langcode).then(definition => {
            sendResponse({ response: definition });
        }).catch(error => {
            sendResponse({ response: error.message });
        });
        return true; // tell content script to wait for word lookup to respond
    }
    if (message.action === "create-anki-card") {
        handleWordLookup(message.word, message.langcode).then(definition => {
            new AnkiBasicCard()
                .word(message.word)
                .sentence(message.sentence)
                .definition(definition)
                .title(message.title)
                .push("firefox").then(() => {
                    browser.notifications.create({
                        "type": "basic",
                        "title": "Lingorino -> Anki",
                        "message": `Added "${message.word}"`
                    });
                }).catch(error => {
                    browser.notifications.create({
                        "type": "basic",
                        "title": "Lingorino -> Anki",
                        "message": `Error: ${error.message}`
                    });
                });
        },
        error => {
            browser.notifications.create({
                "type": "basic",
                "title": "Lingorino",
                "message": `Error: ${error.message}`
            });
        });
    }
});

Anki.checkVersion();
