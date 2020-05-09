import { h, Fragment } from 'preact';
import css from './wordPopupStyle.css';

import { Card, CardState, CardProps } from './Card/Card';
import Fields from './Card/Fields';
import Deck from './Card/Deck';
import NoteType from './Card/NoteType';
import { Field, insertFieldTemplates, ShouldExpandText } from './Card/cardTemplate';

interface CardCreatorProps extends CardProps {
    onGoBack: () => void
}

export default class CardCreator extends Card<CardCreatorProps> {

    constructor(props: CardCreatorProps, _state: CardState) {
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

    render(props: CardCreatorProps, state: CardState) {
        return (
            <Fragment>
                <div id={css.popupDictionaryWindowHeader}>
                    <h4>Create New Card</h4>
                    <button onClick={props.onGoBack}>Back to definition</button>
                </div>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <Fields fields={state.fields} noteType={state.noteType} />
                    <Deck decks={state.decks} onInput={this.changeDeck} curDeck={state.deck} />
                    <NoteType models={state.modelNames} onInput={this.changeNoteType} curNoteType={state.noteType} />
                    <button type="submit">Create card!</button>
                </form>
            </Fragment>
        );
    }
}
