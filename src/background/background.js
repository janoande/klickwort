"use strict";

import handleWordLookup from './wordLookup.js';
import handleSelectionLookup from './selectionLookup.js';
import { ankiCheckVersion, ankiAddBasicNote } from './anki.js';

browser.contextMenus.onClicked.addListener(handleSelectionLookup);

browser.runtime.onMessage.addListener((message , sender, sendResponse) => {
    console.log("background got runtime message");
    if (message.action === "lookup-word") {
        handleWordLookup(message.word, message.langcode).then(data => {
            sendResponse({ response: data || "No definition found." });
        });
        return true; // tell content script to wait for word lookup to respond
    }
    if (message.action === "create-anki-card") {
        ankiAddBasicNote("firefox", message.word, message.sentence);
    }
});

ankiCheckVersion();
