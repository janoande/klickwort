const langs = require('langs');

let word = "";
let language = "";

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

function setWord(newWord) {
    word = newWord;
}
function setLanguage(newLanguage) {
    language = newLanguage;
}

function spin() {
    setPopupContent("<div id=\"popupDictSpinner\"></div>");
}
function getDefinition() {
    spin();
    browser.runtime.sendMessage({
        action: "lookup-word",
        word: word,
        langcode: language
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
function setPositionRelMouse(mouseX, mouseY) {
    // Y coord
    const offset = 20;
    getPopup().style.top = (mouseY + offset) + "px";
    
    // X coord
    const clientWidth = document.documentElement.clientWidth;
    const style = getComputedStyle(getPopup());
    const widthRules = ["width", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"];
    let popupWidth = widthRules.reduce((acc, cur) => {
        return acc + parseFloat(style[cur]);
    }, 0);
    getPopup().style.left = Math.max(Math.min((mouseX - popupWidth/2), clientWidth - popupWidth), 0) + "px";
}

function fixPopupLinks() {
    getPopup().querySelectorAll("a").forEach(elem => {
        const url = new URL(elem.href);

        const langname = url.href.split("#")[1];
        let locale = "en";
        if (langname && langs.has("name", langname)) {
            locale = langs.where("name", langname)["1"];
        }

        const path = url.pathname;
        const word = path.split("/")[path.split("/").length - 1];
        elem.onclick = (e) => {
            e.preventDefault()
            if (word === "Appendix:Glossary") return;
            setWord(word);
            setLanguage(locale);
            getDefinition();
        };
    });
}

function extractSentence(textSelection) {
    let sentence = "";
    const separators = /[.!?]/;

    // first sentence half
    let separatorFound = false;
    let node = textSelection.anchorNode;
    let text = node.textContent.slice(0, window.getSelection().anchorOffset);
    while (!separatorFound) {
        for (const char of text.split('').reverse('').join('')) {
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
        text = node.textContent;
    }
    // second sentence half
    separatorFound = false;
    node = textSelection.anchorNode;
    text = node.textContent.slice(window.getSelection().anchorOffset);
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
        text = node.textContent;
    }
    return sentence;
}

function addToAnki() {
    const sentence = extractSentence(window.getSelection());
    browser.runtime.sendMessage({
        action: "create-anki-card",
        word: word,
        langcode: document.documentElement.lang,
        sentence: sentence,
        title: document.title
    });
}
function setPopupContent(content) {
    document.getElementById("popupDictionaryWindowText").innerHTML = content;
    fixPopupLinks();
}

function show() {
    getPopup().style.display = "block";
}
function hide() {
    getPopup().style.display = "none";
}
function hideOnOutsideClick(e) {
    if (!getPopup().contains(e.target) && document.body.contains(e.target))
        hide();
}

export { create, setPositionRelMouse, spin, setWord, setLanguage, getDefinition, show, hide, hideOnOutsideClick  };
