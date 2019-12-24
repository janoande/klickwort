const langs = require('langs');

let _word = "";
let _locale = "";

function create() {
    let popupDiv = document.createElement("div");
    popupDiv.id = "popupDictionaryWindow";

    let popupTextContainer = document.createElement("div");
    popupTextContainer.id = "popupDictionaryWindowText";
    popupDiv.appendChild(popupTextContainer);

    let ankiButton = document.createElement("button");
    ankiButton.appendChild(document.createTextNode("Add to Anki"));
    ankiButton.addEventListener("click", addToAnki);
    popupDiv.appendChild(ankiButton);

    document.body.appendChild(popupDiv);
}

function setWord(word: string) {
    _word = word;
}
function setLocale(langcode: string) {
    _locale = langcode;
}
function langNameToLocale(langName: string): string {
    if (langName === "" || !langs.has("name", langName))
        return "en";
    return langs.where("name", langName)["1"];
}

function spin() {
    setPopupContent("<div id=\"popupDictSpinner\"></div>");
}
function getDefinition() {
    spin();
    browser.runtime.sendMessage({
        action: "lookup-word",
        word: _word,
        langcode: _locale
    }).then((message) => {
        setPopupContent(message.response);
    },
        (error) => {
            setPopupContent(`Error: ${error}`);
        });
}

function getPopup() {
    return document.getElementById("popupDictionaryWindow");
}
function setPositionRelMouse(mouseX: number, mouseY: number) {
    let popup = getPopup();
    if (popup == null) return;
    // Y coord
    const offset = 20;
    popup.style.top = (mouseY + offset) + "px";

    // X coord
    const clientWidth = document.documentElement.clientWidth;
    const style = getComputedStyle(popup);
    const widthRules = ["width", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"];
    let popupWidth = widthRules.reduce((acc: number, cur: string) => {
        // @ts-ignore
        return acc + parseFloat(style[cur]);
    }, 0);
    popup.style.left = Math.max(Math.min((mouseX - popupWidth / 2), clientWidth - popupWidth), 0) + "px";
}

function fixPopupLinks() {
    let popup = getPopup();
    if (popup == null) return;
    popup.querySelectorAll("a").forEach(elem => {
        const url = new URL(elem.href);
        const langname = url.href.split("#")[1];
        const path = url.pathname;
        const word = path.split("/")[path.split("/").length - 1];
        elem.onclick = (e) => {
            e.preventDefault()
            if (word === "Appendix:Glossary") return;
            setWord(word);
            setLocale(langNameToLocale(langname));
            getDefinition();
        };
    });
}

function extractSentence(textSelection: Selection) {
    let sentence = "";
    const separators = /[.!?]/;

    // first sentence half
    let separatorFound = false;
    let node = textSelection.anchorNode;
    if (node == null || node.textContent == null) return "";
    let text = node.textContent.slice(0, window.getSelection()!.anchorOffset);
    while (!separatorFound) {
        for (const char of text.split('').reverse().join('')) {
            sentence = char + sentence;
            if (char.match(separators)) {
                sentence = sentence.slice(2);
                separatorFound = true;
                break;
            }
        }
        node = node.previousSibling;
        if (!node)
            break;
        if (node.textContent)
            text = node.textContent;
    }
    // second sentence half
    separatorFound = false;
    node = textSelection.anchorNode;
    if (node == null || node.textContent == null) return sentence;
    text = node.textContent.slice(window.getSelection()!.anchorOffset);
    while (!separatorFound) {
        for (const char of text) {
            sentence = sentence + char;
            if (char.match(separators)) {
                separatorFound = true;
                break;
            }
        }
        node = node.nextSibling;
        if (!node)
            break;
        if (node.textContent)
            text = node.textContent;
    }
    return sentence;
}

function addToAnki() {
    const sentence = extractSentence(window.getSelection()!);
    browser.runtime.sendMessage({
        action: "create-anki-card",
        word: _word,
        langcode: _locale,
        // NOTE: if we click on another word in the popup, then the current
        //       sentence may not be relevant anymore
        sentence: sentence,
        title: document.title
    });
}
function setPopupContent(content: string) {
    let popupText = document.getElementById("popupDictionaryWindowText");
    if (popupText) {
        popupText.innerHTML = content;
        fixPopupLinks();
    }
}

function show() {
    let popup = getPopup();
    if (popup)
        popup.style.display = "block";
}
function hide() {
    let popup = getPopup();
    if (popup)
        popup.style.display = "none";
}
function hideOnOutsideClick(e: Event) {
    let popup = getPopup();
    if (popup && e) {
        let target = e.target;
        if (target instanceof Element && !popup.contains(target) && document.body.contains(target))
            hide();
    }
}

export { create, setPositionRelMouse, spin, setWord, setLocale, getDefinition, show, hide, hideOnOutsideClick };
