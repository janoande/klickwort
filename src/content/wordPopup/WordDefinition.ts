const langs = require('langs');

export default class WordDefinition {
    private node: HTMLElement;
    private definitionTextElem: HTMLElement;
    private ankiButtonElem: HTMLElement;
    private word = "";
    private locale = "";

    constructor() {
        this.node = document.createElement("div");
        this.definitionTextElem = document.createElement("div");
        this.definitionTextElem.id = "popupDictionaryWindowText";
        this.node.appendChild(this.definitionTextElem);
        this.ankiButtonElem = document.createElement("button");
        this.ankiButtonElem.appendChild(document.createTextNode("Add to Anki"));
        this.ankiButtonElem.addEventListener("click", () => {
            this.addToAnki();
        });
        this.node.appendChild(this.ankiButtonElem);
    }
    getNode(): HTMLElement {
        return this.node;
    }
    setWord(word: string): void {
        this.word = word;
    }
    setLocale(locale: string): void {
        this.locale = locale;
    }
    setDefinitionContent(newContent: string): void {
        this.definitionTextElem.innerHTML = newContent;
    }
    langNameToLocale(langName: string): string {
        if (langName === "" || !langs.has("name", langName))
            return "en";
        return langs.where("name", langName)["1"];
    }

    extractSentence(textSelection: Selection): string {
        let sentence = "";
        const separators = /[.!?]/;

        // first sentence half
        let separatorFound = false;
        let node = textSelection.anchorNode;
        if (node == null || node.textContent == null) return "";
        let text = node.textContent.slice(0, window.getSelection()!.anchorOffset);
        while (!separatorFound) {
            for (const char of text.split('').reverse().join('')) {
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
            if (node.textContent)
                text = node.textContent;
        }
        // second sentence half
        separatorFound = false;
        node = textSelection.anchorNode;
        if (node == null || node.textContent == null) return sentence;
        text = node.textContent.slice(window.getSelection()!.anchorOffset);
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
            if (node.textContent)
                text = node.textContent;
        }
        return sentence;
    }

    spin(): void {
        this.setDefinitionContent("<div id=\"popupDictSpinner\"></div>");
    }

    getDefinition(): void {
        this.spin();
        browser.runtime.sendMessage({
            action: "lookup-word",
            word: this.word,
            langcode: this.locale
        }).then((message) => {
            // TODO: should probably strip out non-textformatting tags for security
            this.definitionTextElem.innerHTML = message.response;
        }, error => {
            this.definitionTextElem.innerHTML = `Error: ${error}`;
        });
    }

    // TODO: switch to card creator
    addToAnki(): void {
        const sentence = this.extractSentence(window.getSelection()!);
        let popupDefinitionTextDiv = document.getElementById("popupDictionaryWindowText");
        if (popupDefinitionTextDiv === null) {
            console.error("Could not find definition text in popup (is null)");
            return;
        }
        let definitionText = popupDefinitionTextDiv.innerHTML;
        browser.runtime.sendMessage({
            action: "create-anki-card",
            word: this.word,
            langcode: this.locale,
            // NOTE: if we click on another word in the popup, then the current
            //       sentence may not be relevant anymore
            sentence: sentence,
            title: document.title,
            definition: definitionText
        });
    }

    fixPopupLinks(): void {
        this.definitionTextElem.querySelectorAll("a").forEach(elem => {
            const url = new URL(elem.href);
            const langname = url.href.split("#")[1];
            const path = url.pathname;
            const word = path.split("/")[path.split("/").length - 1];
            elem.onclick = (e) => {
                e.preventDefault()
                if (word === "Appendix:Glossary") return;
                this.word = word;
                this.locale = this.langNameToLocale(langname);
                this.getDefinition();
            };
        });
    }

}

