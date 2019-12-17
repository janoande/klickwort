"use strict";

import handleWordLookup from './wordLookup.js';
import handleSelectionLookup from './selectionLookup.js';
import { ankiCheckVersion, ankiAddBasicNote } from './anki.js';

browser.contextMenus.onClicked.addListener(handleSelectionLookup);

browser.runtime.onMessage.addListener((message , sender, sendResponse) => {
    console.log("background got runtime message");
    if (message.action === "lookup-word") {
        handleWordLookup(message.word, message.langcode).then(definition => {
            sendResponse({ response: definition || "No definition found." });
        });
        return true; // tell content script to wait for word lookup to respond
    }
    if (message.action === "create-anki-card") {
        handleWordLookup(message.word, message.langcode).then(definition => {
            console.log("adding", message.word, "with definition", definition);
            if (definition)
                ankiAddBasicNote("firefox", message.word, `${definition} <p>${message.sentence}</p>`);
            else
                console.log(`Failed to find a definition for "${message.word}"`);
        });
    }
});

ankiCheckVersion();
