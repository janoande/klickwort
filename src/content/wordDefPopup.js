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

export { createPopupElement, getPopup, togglePopup, showPopup, hidePopup };
