"use strict";

import handleWordLookup from './wordLookup.js';
import handleSelectionLookup from './selectionLookup.js';
import { ankiCheckVersion, ankiAddBasicNote } from './anki.js';

browser.contextMenus.onClicked.addListener(handleSelectionLookup);

browser.runtime.onMessage.addListener((message , sender, sendResponse) => {
    if (message.action === "lookup-word") {
        handleWordLookup(message.word, message.langcode).then(definition => {
            sendResponse({ response: definition || "No definition found." });
        });
        return true; // tell content script to wait for word lookup to respond
    }
    if (message.action === "create-anki-card") {
        handleWordLookup(message.word, message.langcode).then(definition => {
            ankiAddBasicNote("firefox",
                                message.word,
                                `${definition} <p>${message.sentence}</p>`)
                .then(response => {
                    if (response.error) {
                        browser.notifications.create({
                            "type": "basic",
                            "title": "ERROR: Lingorino -> Anki",
                            "message": response.error
                        });
                    }
                    else {
                        browser.notifications.create({
                            "type": "basic",
                            "title": "Lingorino -> Anki",
                            "message": `Added "${message.word}"`
                        });
                    }
                }).catch(error => {
                    browser.notifications.create({
                        "type": "basic",
                        "title": "ERROR: Lingorino -> Anki",
                        "message": error.message
                    });
                });
        },
        error => {
            browser.notifications.create({
                "type": "basic",
                "title": "ERROR: Lingorino -> Anki",
                "message": error.message
            });
        });
    }
});

ankiCheckVersion();
