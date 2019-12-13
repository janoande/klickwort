
window.addEventListener("dblclick", notifyDoubleClick);

function notifyDoubleClick() {
    browser.runtime.sendMessage({ word: window.getSelection().toString(),
                                  langcode: document.documentElement.lang });
}
