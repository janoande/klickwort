import { h, Component } from 'preact';
import { insertFieldTemplates, Field, TemplateData } from './cardTemplate';

interface CardCreatorProps {
    templateData: TemplateData
}

interface CardMetaData {
    deck: string,
    noteType: string,
    fields: Field[]
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
            fields: [{ name: "Front", value: "" }, { name: "Back", value: "" }],
            decks: ["Default"]
        });
        this.fetchDecks().then(({ decks }) => {
            this.fetchModelNames().then(({ models }) => {
                this.fetchNoteFields("Basic").then(fields => {
                    this.setState({
                        deck: "firefox",
                        noteType: "Basic",
                        fields: insertFieldTemplates("Basic", fields, this.props.templateData),
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

    async fetchNoteFields(noteType: string): Promise<Field[]> {
        const { fields } = await browser.runtime.sendMessage({ action: "anki-fetch-fields", modelName: noteType });
        return fields.map((fieldName: string) => { return { name: fieldName, value: "" } });
    }

    changeDeck(e: any) {
        this.setState({ deck: e.target.value });
    }

    changeNoteType(e: any) {
        const noteType = e.target.value;

        this.fetchNoteFields(noteType).then(fields => {
            this.setState({
                noteType: noteType,
                fields: insertFieldTemplates(noteType, fields, this.props.templateData)
            });
        });
    }

    pushNote(cardData: CardMetaData): void {
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
                            <li><label>{field.name}:<textarea name={field.name}>{field.value}</textarea></label></li>
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
