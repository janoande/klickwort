"use strict";

import handleWordLookup from './wordLookup';
import handleSelectionLookup from './selectionLookup';
import { Anki, AnkiBasicCard } from './anki';

// @ts-ignore
browser.contextMenus.onClicked.addListener(handleSelectionLookup);

browser.runtime.onMessage.addListener(
    (message: any, _sender: browser.runtime.MessageSender, sendResponse: (arg0: any) => Promise<any>) => {
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
                    .setWord(message.word)
                    .setSentence(message.sentence)
                    .setDefinition(typeof definition === "string" ? definition : "")
                    .setTitle(message.title)
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
    }
);

Anki.checkVersion();
