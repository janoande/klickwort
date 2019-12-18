function createPopupElement() {
    console.log("Creating the word popup element.");
    let popupDiv = document.createElement("div");
    popupDiv.id = "popupDictionaryWindow";
    let popupText = document.createTextNode("<Dictionary definition goes here>");
    popupDiv.appendChild(popupText);
    document.body.appendChild(popupDiv);
}

function getPopup() {
    return document.getElementById("popupDictionaryWindow");
}
function setPopupXRelativeMouse(mouseX) {
    const clientWidth = document.documentElement.clientWidth;
    const style = getComputedStyle(getPopup());
    const widthRules = ["width", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"];
    let popupWidth = widthRules.reduce((acc, cur) => {
        return acc + parseFloat(style[cur]);
    }, 0);
    getPopup().style.left = Math.max(Math.min((mouseX - popupWidth/2), clientWidth - popupWidth), 0) + "px";
}
function setPopupYRelativeMouse(mouseY) {
    const offset = 20;
    getPopup().style.top = (mouseY + offset) + "px";
}
function setPopupContent(content) {
    getPopup().innerHTML = content;
}
function showPopup() {
    getPopup().style.display = "block";
}
function hidePopup() {
    getPopup().style.display = "none";
}

function togglePopup() {
    let popup = getPopup();
    if (popup.style.display === "block")
        popup.style.display = "none";
    else
        popup.style.display = "block";
}

export { createPopupElement, getPopup, setPopupXRelativeMouse, setPopupYRelativeMouse, setPopupContent, togglePopup, showPopup, hidePopup };
