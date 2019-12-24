import * as PopupDictionary from './wordDefPopup';

function notifyDoubleClick(e: MouseEvent) {
    if (e.altKey) {
        PopupDictionary.setPositionRelMouse(e.pageX, e.pageY);
        PopupDictionary.setWord(window.getSelection()!.toString());
        PopupDictionary.setLocale(document.documentElement.lang);
        PopupDictionary.getDefinition();
        PopupDictionary.show();
    }
}

export default notifyDoubleClick;
