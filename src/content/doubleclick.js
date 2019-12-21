import * as PopupDictionary from './wordDefPopup.js';

function notifyDoubleClick(e) {
    if (e.altKey) {
        PopupDictionary.setPositionRelMouse(e.pageX, e.pageY)
        PopupDictionary.setWord(window.getSelection().toString())
        PopupDictionary.setLanguage(document.documentElement.lang)
        PopupDictionary.getDefinition()
        PopupDictionary.show();
    }
}

export default notifyDoubleClick;
