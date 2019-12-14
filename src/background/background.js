"use strict";

import handleWordLookup from './wordLookup.js';
import handleSelectionLookup from './selectionLookup.js';
import { ankiCheckVersion, ankiCreateCard } from './anki.js';

browser.contextMenus.onClicked.addListener(handleSelectionLookup);

browser.runtime.onMessage.addListener((message, sender, senderResponse) => {
    if (message.action === "lookup-word")
        handleWordLookup(message.word, message.langcode);
    if (message.action === "create-anki-card") {
        ankiCreateCard(message.word, message.sentence);
    }
});


ankiCheckVersion();
