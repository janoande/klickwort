import * as PopupDictionary from './wordPopup/wordPopup';

function notifyDoubleClick(e: MouseEvent) {
    if (e.altKey) {
        PopupDictionary.handleWordClick(e);
    }
}

export default notifyDoubleClick;
