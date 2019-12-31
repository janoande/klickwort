"use strict";

import handleWordLookup from './wordLookup';
import handleSelectionLookup from './selectionLookup';
import { Anki } from './anki';

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
        else if (message.action === "anki-check-version") {
            Anki.checkVersion().then(version => {
                if (version.expected !== version.got) {
                    browser.notifications.create({
                        "type": "basic",
                        "title": "Lingorino -> Anki",
                        "message": "Warning: expected AnkiConnect version " + version.expected + " but current version is " + version.got
                    });
                }
                sendResponse({ response: version });
            }).catch(error => {
                sendResponse({ response: null, error: error.message });
            });
            return true;
        }
        else if (message.action === "anki-fetch-decks") {
            Anki.fetchDecks().then(decks => {
                sendResponse({ decks: decks });
            });
            return true;
        }
        else if (message.action === "anki-fetch-model-names") {
            Anki.fetchModelNames().then(models => {
                sendResponse({ models: models });
            },
                error => {
                    sendResponse({ models: "Sorry, no models found." + error.message });
                });
            return true;
        }
        else if (message.action === "anki-fetch-fields") {
            Anki.fetchFields(message.modelName).then(fields => {
                sendResponse({ fields: fields });
            });
            return true;
        }
        else if (message.action === "create-anki-card") {
            Anki.pushCard(message.card.deck, message.card.noteType, message.card.fields)
                .then(() => {
                    browser.notifications.create({
                        "type": "basic",
                        "title": "Lingorino -> Anki",
                        "message": `Added new ${message.card.noteType} card to deck ${message.card.deck}`
                    });
                }).catch(error => {
                    browser.notifications.create({
                        "type": "basic",
                        "title": "Lingorino -> Anki",
                        "message": `Error: ${error.message}`
                    });
                });
        }
        else {
            console.error(`Background action ${message.acion} is not implemented.`)
        }
    }
);

