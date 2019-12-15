
window.addEventListener("dblclick", notifyDoubleClick);

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
        browser.runtime.sendMessage({
            action: "lookup-word",
            word: window.getSelection().toString(),
            langcode: document.documentElement.lang
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
