import { h } from 'preact';

import { Card, CardState, CardProps } from '../content/wordPopup/Card/Card';
import Fields from '../content/wordPopup/Card/Fields';
import Deck from '../content/wordPopup/Card/Deck';
import NoteType from '../content/wordPopup/Card/NoteType';
import { saveTemplate } from '../content/wordPopup/Card/cardTemplate';
import { Field, ShouldExpandText, insertFieldTemplates } from '../content/wordPopup/Card/cardTemplate';

export default class TemplateEditor extends Card {

    constructor(props: CardProps, _state: CardState) {
        super(props);
    }

    onSubmit(e: Event): void {
        if (!e || !e.target) return;
        e.preventDefault();
        const data = this.collectFormData(e.target);
        saveTemplate(data.noteType, data.fields);
    }

    changeNoteType(e: any) {
        const noteType = e.target.value;

        this.fetchNoteFields(noteType).then(fields => {
            insertFieldTemplates(noteType, fields, this.props.templateData, ShouldExpandText.No).then((fields: Field[]): void => {
                this.setState({
                    noteType: noteType,
                    fields: fields
                });
            });
        });
    }

    render(_props: CardProps, state: CardState) {
        return (
            <form onSubmit={this.onSubmit.bind(this)}>
                <h1> Template editor</h1 >
                <Fields fields={state.fields} noteType={state.noteType} />
                <Deck decks={state.decks} onInput={this.changeDeck} curDeck={state.deck} />
                <NoteType models={state.modelNames} onInput={this.changeNoteType} curNoteType={state.noteType} />
                <button type="submit">Save template</button>
            </form>
        );
    };
}
