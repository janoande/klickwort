import { createPopupElement, hidePopup } from './wordDefPopup.js';
import notifyDoubleClick from './doubleclick.js';

window.addEventListener('click', hidePopup);
window.addEventListener('dblclick', notifyDoubleClick);
window.addEventListener('DOMContentLoaded', createPopupElement);
