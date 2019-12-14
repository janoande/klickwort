
window.addEventListener("dblclick", notifyDoubleClick);

function extractSentence(text, word) {
    for (sentence of text.match(/[^\.!\?]+[\.!\?]+/g)) {
        if (sentence.indexOf(word) != -1) {
            return sentence.trim();
        }
    }
    return "";
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
        const text = e.target.innerText;
        const sentence = extractSentence(text, word);
        browser.runtime.sendMessage({
            action: "create-anki-card",
            word: word,
            sentence: sentence
        })
    }
}
