
window.addEventListener("dblclick", notifyDoubleClick);

function notifyDoubleClick(e) {
    if (e.altKey) {
        browser.runtime.sendMessage({
            word: window.getSelection().toString(),
            langcode: document.documentElement.lang
        });
    }
}
