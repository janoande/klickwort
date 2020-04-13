import * as langs from 'langs';
import getSetting from '../common/getSetting';

// @ts-ignore
browser.contextMenus.create({
    id: "google-trans-selection",
    title: "Translate with Google Translate",
    contexts: ["selection"]
});

// @ts-ignore
browser.contextMenus.create({
    id: "deepl-trans-selection",
    title: "Translate with DeepL",
    contexts: ["selection"]
});

// @ts-ignore
browser.contextMenus.create({
    id: "wiktionary-trans-word",
    title: "Translate with Wiktionary",
    contexts: ["selection"]
});

function selectionLookup(info: browser.menus.OnClickData, tab: browser.tabs.Tab) {
    if (typeof info.selectionText !== "string")
        return;
    getSetting("targetLanguage").then((targetLanguage) => {
        if (typeof targetLanguage !== "string")
            return;
        const targetLocale = langs.where("name", targetLanguage)["1"];
        switch (info.menuItemId) {
            case "google-trans-selection":
                if (info.selectionText)
                    browser.tabs.create({
                        url: `https://translate.google.com/#view=home&op=translate&sl=auto&tl=${targetLocale}&text=${encodeURIComponent(info.selectionText)}`,
                        index: tab.index + 1
                    });
                break;
            case "deepl-trans-selection":
                if (info.selectionText)
                    browser.tabs.create({
                        url: `https://www.deepl.com/translator#auto/${targetLocale}/${encodeURIComponent(info.selectionText)}`,
                        index: tab.index + 1
                    });
                break;
            case "wiktionary-trans-word":
                browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
                    const curTabIndex = tabs[0].index;
                    browser.tabs.detectLanguage().then(langcode => {
                        const language = (langs.where("1", langcode) || { name: "English" }).name;
                        if (info.selectionText == undefined) return;
                        browser.tabs.create({
                            url: `https://${targetLocale}.wiktionary.org/w/index.php?search=${encodeURIComponent(info.selectionText)}#${encodeURIComponent(language)}`,
                            index: curTabIndex + 1
                        });
                    });
                });
                break;
        }
    });
}

export default selectionLookup;
