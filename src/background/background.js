"use strict";

import handleWordLookup from './wordLookup.js';
import handleSelectionLookup from './selectionLookup.js';
import { ankiCheckVersion } from './anki.js';

browser.runtime.onMessage.addListener(handleWordLookup);
browser.contextMenus.onClicked.addListener(handleSelectionLookup);

ankiCheckVersion();
