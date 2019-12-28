export default class CardCreator {
    private node: HTMLElement;
    private formsElem: HTMLElement;
    private optionsElem: HTMLElement;
    constructor() {
        this.node = document.createElement("div");
        this.formsElem = document.createElement("div");
        this.formsElem.id = "popupCardCreateForms";
        this.node.appendChild(this.formsElem);
        this.optionsElem = document.createElement("div");
        this.optionsElem.appendChild(document.createTextNode("Edit your new card here."));
        this.optionsElem.id = "popupCardCreateOptions";
        this.node.appendChild(this.optionsElem);
    }
    getNode(): HTMLElement {
        return this.node;
    }
    show() {
        this.node.style.display = "block";
    }
    hide() {
        this.node.style.display = "none";
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

    // addToAnki(): void {
    //     const sentence = this.extractSentence(window.getSelection()!);
    //     let popupDefinitionTextDiv = document.getElementById("popupDictionaryWindowText");
    //     if (popupDefinitionTextDiv === null) {
    //         console.error("Could not find definition text in popup (is null)");
    //         return;
    //     }
    //     let definitionText = popupDefinitionTextDiv.innerHTML;
    //     browser.runtime.sendMessage({
    //         action: "create-anki-card",
    //         word: this.word,
    //         langcode: this.locale,
    //         // NOTE: if we click on another word in the popup, then the current
    //         //       sentence may not be relevant anymore
    //         sentence: sentence,
    //         title: document.title,
    //         definition: definitionText
    //     });
    // }
}
