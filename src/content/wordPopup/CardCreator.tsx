import { h, Component } from 'preact';

interface CardCreatorProps {
    decks: string[],
    noteTypes: string[]
}

interface CardMetaData {
    "deck": string,
    "noteType": string,
    "fields": { [key: string]: string }
}

interface CardCreatorState extends CardMetaData {
}

export default class CardCreator extends Component<CardCreatorProps, CardCreatorState> {
    constructor(props: CardCreatorProps) {
        super(props);
        this.setState({
            deck: "firefox",
            noteType: "Basic",
            fields: this.fetchNoteFields("Basic")
        });
        this.changeDeck = this.changeDeck.bind(this);
        this.changeNoteType = this.changeNoteType.bind(this);
        this.collectFormData = this.collectFormData.bind(this);
        this.pushNote = this.pushNote.bind(this);
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

    fetchNoteFields(noteType: string): { [key: string]: string } {
        // TODO: fetch fields from Anki-connect
        switch (noteType) {
            case "Basic": return { "Front": "", "Back": "" };
            case "Cloze": return { "Text": "", "Extra": "" };
            case "MySpecialNote": return { "FrontText": "", "BackText": "", "FunFact": "" };
            default: return {};
        }
    }

    changeNoteType(e: any) {
        // TODO: auto fill fields as specified by rules
        const noteType = e.target.value;
        this.setState({
            noteType: noteType,
            fields: this.fetchNoteFields(noteType)
        });
    }

    pushNote(cardData: CardMetaData): void {
        // TODO: push card to Anki
        console.log("Card to push:", cardData);
        /* browser.runtime.sendMessage({
         *     action: "create-anki-card",
         *     word: this.word,
         *     langcode: this.locale,
         *     // NOTE: if we click on another word in the popup, then the current
         *     //       sentence may not be relevant anymore
         *     sentence: sentence,
         *     title: document.title,
         *     definition: definitionText
         * }); */
    }

    collectFormData(form: EventTarget): CardMetaData {
        let formData: CardMetaData = { deck: "", noteType: "", fields: {} };
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

    render(props: CardCreatorProps, state: CardCreatorState) {
        return (
            <div>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <b>Fields:</b><br />
                    <ul>
                        {Object.keys(state.fields).map(field =>
                            <li><label>{field}:<textarea name={field} /></label></li>
                        )}
                    </ul>
                    <label>
                        Deck:
                        <select name="deck" onInput={this.changeDeck} value={state.deck}>
                            {props.decks.map(deck => <option value={deck}>{deck}</option>)}
                        </select>
                    </label>
                    <label>
                        Note type:
                        <select name="noteType" onInput={this.changeNoteType} value={state.noteType}>
                            {props.noteTypes.map(noteType => <option value={noteType}>{noteType}</option>)}
                        </select>
                    </label>
                    <button type="submit">Send</button>
                </form>
            </div>
        );
    }
}
