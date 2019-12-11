
window.addEventListener("dblclick", notifyDoubleClick);

function notifyDoubleClick(e) {
    browser.runtime.sendMessage({ word: window.getSelection().toString(),
                                  langcode: document.documentElement.lang });
}
