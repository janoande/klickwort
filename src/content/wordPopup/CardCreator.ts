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
        this.optionsElem.id = "popupCardCreateOptions";
        this.node.appendChild(this.optionsElem);
    }
    getNode(): HTMLElement {
        return this.node;
    }
}
