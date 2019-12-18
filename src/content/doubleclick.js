import { getPopup, showPopup } from './wordDefPopup.js';

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

function notifyDoubleClick(e) {
    if (e.altKey) {
        let sending = browser.runtime.sendMessage({
            action: "lookup-word",
            word: window.getSelection().toString(),
            langcode: document.documentElement.lang
        });
        sending.then((message) => {
            let clientWidth = document.documentElement.clientWidth;
            let popup = getPopup();
            popup.innerHTML = message.response;
            popup.style.left = Math.max(Math.min((e.pageX - 200), clientWidth - 400), 0) + "px";
            popup.style.top = (e.pageY + 20) + "px";
            showPopup();
        },
        (error) => {
            console.log(`Error: ${error}`);
        });
    }
    if (e.shiftKey) {
        const word = window.getSelection().toString();
        const sentence = extractSentence(window.getSelection());
        browser.runtime.sendMessage({
            action: "create-anki-card",
            word: word,
            sentence: sentence
        });
    }
}

export default notifyDoubleClick;
