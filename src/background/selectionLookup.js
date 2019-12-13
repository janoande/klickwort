browser.contextMenus.create({
    id: "google-trans-selection",
    title: "Translate with Google Translate",
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "deepl-trans-selection",
    title: "Translate with DeepL",
    contexts: ["selection"]
});

function selectionLookup(info, tab) {
    switch (info.menuItemId) {
        case "google-trans-selection":
            browser.tabs.create({
                url: "https://translate.google.se/#view=home&op=translate&sl=auto&tl=en&text=" + encodeURIComponent(info.selectionText),
                index: tab.index + 1
            });
        break;
        case "deepl-trans-selection":
            browser.tabs.create({
                url: "https://www.deepl.com/translator#auto/en/" + encodeURIComponent(info.selectionText),
                index: tab.index + 1
            });
        break;
        }
}

export default selectionLookup;
