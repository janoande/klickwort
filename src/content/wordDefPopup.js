const langs = require('langs');

let word = "";
let language = "";

function create() {
    let popupDiv = document.createElement("div");
    popupDiv.id = "popupDictionaryWindow";
    let popupText = document.createTextNode("<Dictionary definition goes here>");
    popupDiv.appendChild(popupText);
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
            show();
        };
        elem.href = "#";
    });
}
function setPopupContent(content) {
    getPopup().innerHTML = content;
    fixPopupLinks();
}

function show() {
    getPopup().style.display = "block";
}
function hide() {
    getPopup().style.display = "none";
}
function hideOnOutsideClick(e) {
    if (!getPopup().contains(e.target))
        hide();
}

export { create, setPositionRelMouse, spin, setWord, setLanguage, getDefinition, show, hide, hideOnOutsideClick  };
