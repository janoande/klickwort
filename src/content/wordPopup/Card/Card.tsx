import { Component, ComponentChild } from 'preact';
import { Field, TemplateData, ShouldExpandText, insertFieldTemplates } from './cardTemplate';

export interface CardProps {
    templateData: TemplateData,
    expand: ShouldExpandText
}

interface CardMetaData {
    deck: string,
    noteType: string,
    fields: Field[]
}

export interface CardState extends CardMetaData {
    modelNames: string[],
    decks: string[]
}

export abstract class Card<T extends CardProps> extends Component<T, CardState> {
    constructor(props: CardProps) {
        super();
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
                    insertFieldTemplates("Basic", fields, props.templateData, props.expand).then((fields: Field[]): void => {
                        this.setState({
                            noteType: "Basic",
                            fields: fields,
                            deck: "firefox",
                            modelNames: models,
                            decks: decks
                        });
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
                fields: fields
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
                const field: Field = { name: input.name, value: input.value };
                formData.fields.push(field);
            }
        });
        return formData;
    }

    abstract onSubmit(e: Event): void;

    abstract render(props: T, state: CardState): ComponentChild;
}
