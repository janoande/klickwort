"use strict";

import handleWordLookup from './wordLookup.js';
import handleSelectionLookup from './selectionLookup.js';

browser.runtime.onMessage.addListener(handleWordLookup);
browser.contextMenus.onClicked.addListener(handleSelectionLookup);
