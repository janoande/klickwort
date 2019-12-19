import * as PopupDictionary from './wordDefPopup.js';
import notifyDoubleClick from './doubleclick.js';

window.addEventListener('click', PopupDictionary.hideOnOutsideClick);
window.addEventListener('dblclick', notifyDoubleClick);
window.addEventListener('DOMContentLoaded', PopupDictionary.create);
