import { h, Component } from 'preact';

interface CardCreatorProps { }

interface CardMetaData {
    deck: string,
    noteType: string,
    fields: string[]
}

interface CardCreatorState extends CardMetaData {
    modelNames: string[],
    decks: string[]
}

export default class CardCreator extends Component<CardCreatorProps, CardCreatorState> {
    constructor(props: CardCreatorProps) {
        super(props);
        this.setState({
            deck: "Default",
            noteType: "Basic",
            modelNames: ["Basic", "Cloze"],
            fields: ["Front", "Back"],
            decks: ["Default"]
        });
        this.fetchDecks().then(({ decks }) => {
            this.fetchModelNames().then(({ models }) => {
                this.fetchNoteFields("Basic").then(({ fields }) => {
                    this.setState({
                        deck: "firefox",
                        noteType: "Basic",
                        fields: fields,
                        modelNames: models,
                        decks: decks
                    });
                });
            });
        });

        this.changeDeck = this.changeDeck.bind(this);
        this.changeNoteType = this.changeNoteType.bind(this);
        this.collectFormData = this.collectFormData.bind(this);
        this.pushNote = this.pushNote.bind(this);
    }

    fetchModelNames(): Promise<any> {
        return browser.runtime.sendMessage({ action: "anki-fetch-model-names" });
    }

    fetchDecks(): Promise<any> {
        return browser.runtime.sendMessage({ action: "anki-fetch-decks" });
    }

    fetchNoteFields(noteType: string): Promise<{ fields: string[] }> {
        return browser.runtime.sendMessage({ action: "anki-fetch-fields", modelName: noteType });
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

    changeDeck(e: any) {
        this.setState({ deck: e.target.value });
    }

    changeNoteType(e: any) {
        // TODO: auto fill fields as specified by rules
        const noteType = e.target.value;
        this.fetchNoteFields(noteType).then(({ fields }) => {
            this.setState({
                noteType: noteType,
                fields: fields
            });
        });
    }

    pushNote(cardData: CardMetaData): void {
        console.log("Card to push:", cardData);
        browser.runtime.sendMessage({
            action: "create-anki-card",
            card: cardData
        });
    }

    collectFormData(form: EventTarget): CardMetaData {
        let formData: CardMetaData = { deck: "", noteType: "", fields: [] };
        // @ts-ignore
        Array.from(form).forEach(input => {
            if (input.tagName == "SELECT") {
                const selectDataName: "deck" | "noteType" = input.name;
                formData[selectDataName] = input.value;
            }
            else if (input.tagName == "TEXTAREA") {
                formData.fields = { [input.name]: input.value, ...formData.fields };
            }
        });
        return formData;
    }

    onSubmit(e: Event): void {
        if (!e || !e.target) return;
        e.preventDefault();
        const data = this.collectFormData(e.target);
        this.pushNote(data);
    }

    render(_props: any, state: CardCreatorState) {
        return (
            <div>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <b>Fields:</b><br />
                    <ul>
                        {state.fields.map(field =>
                            <li><label>{field}:<textarea name={field} /></label></li>
                        )}
                    </ul>
                    <label>
                        Deck:
                        <select name="deck" onInput={this.changeDeck} value={state.deck}>
                            {state.decks.map(deck => <option value={deck}>{deck}</option>)}
                        </select>
                    </label><br />
                    <label>
                        Note type:
                        <select name="noteType" onInput={this.changeNoteType} value={state.noteType}>
                            {state.modelNames.map(noteType => <option value={noteType}>{noteType}</option>)}
                        </select>
                    </label>
                    <button type="submit">Send</button>
                </form>
            </div>
        );
    }
}
