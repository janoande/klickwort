import { h } from 'preact';

import { Card, CardState, CardProps } from './Card/Card';
import Fields from './Card/Fields';
import Deck from './Card/Deck';
import NoteType from './Card/NoteType';
import { Field, insertFieldTemplates, ShouldExpandText } from './Card/cardTemplate';

export default class CardCreator extends Card {

    constructor(props: CardProps, _state: CardState) {
        super(props);
    }
    onSubmit(e: Event): void {
        if (!e || !e.target) return;
        e.preventDefault();
        const data = this.collectFormData(e.target);
        this.pushNote(data);
    }

    changeNoteType(e: any) {
        const noteType = e.target.value;

        this.fetchNoteFields(noteType).then(fields => {
            insertFieldTemplates(noteType, fields, this.props.templateData, ShouldExpandText.Yes).then((fields: Field[]): void => {
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
                <Fields fields={state.fields} noteType={state.noteType} />
                <Deck decks={state.decks} onInput={this.changeDeck} curDeck={state.deck} />
                <NoteType models={state.modelNames} onInput={this.changeNoteType} curNoteType={state.noteType} />
                <button type="submit">Create card!</button>
            </form>
        );
    }
}
