import * as PopupDictionary from './wordPopup/wordPopup';
import notifyDoubleClick from './doubleclick';

window.addEventListener('click', PopupDictionary.hideOnOutsideClick);
window.addEventListener('dblclick', notifyDoubleClick);
window.addEventListener('DOMContentLoaded', PopupDictionary.create);
