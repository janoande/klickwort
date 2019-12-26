import WordDefinition from './WordDefinition';
import CardCreator from './CardCreator';

let popupElement: HTMLElement;
let wordDefinitionElem: WordDefinition;
let cardCreatorElem: CardCreator;

function create() {
    popupElement = document.createElement("div");
    popupElement.id = "popupDictionaryWindow";

    wordDefinitionElem = new WordDefinition();
    popupElement.appendChild(wordDefinitionElem.getNode());

    cardCreatorElem = new CardCreator();
    popupElement.appendChild(cardCreatorElem.getNode());

    document.body.appendChild(popupElement);
}

function setPositionRelMouse(mouseX: number, mouseY: number) {
    const offset = 20;
    const yCoord = (mouseY + offset) + "px"

    const clientWidth = document.documentElement.clientWidth;
    const style = getComputedStyle(popupElement);
    const widthRules = ["width", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"];
    const popupWidth = widthRules.reduce((acc: number, cur: string) => {
        // @ts-ignore
        return acc + parseFloat(style[cur]);
    }, 0);
    const xCoord = Math.max(Math.min((mouseX - popupWidth / 2), clientWidth - popupWidth), 0) + "px";

    popupElement.style.left = xCoord;
    popupElement.style.top = yCoord;
}

function show() {
    popupElement.style.display = "block";
}
function hide() {
    popupElement.style.display = "none";
}
function hideOnOutsideClick(e: Event) {
    if (e) {
        let target = e.target;
        if (target instanceof Element && !popupElement.contains(target) && document.body.contains(target))
            hide();
    }
}

function handleWordClick(e: MouseEvent): void {
    setPositionRelMouse(e.pageX, e.pageY);
    wordDefinitionElem.setWord(window.getSelection()!.toString());
    wordDefinitionElem.setLocale(document.documentElement.lang);
    wordDefinitionElem.getDefinition();
    wordDefinitionElem.fixPopupLinks();
    show();
}

export { create, hideOnOutsideClick, handleWordClick };
