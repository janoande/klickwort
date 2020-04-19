import { h, Component, Fragment } from 'preact';

interface DeckProps {
    onInput: (e: any) => void,
    curDeck: string,
    decks: string[]
}

export default class Deck extends Component<DeckProps> {
    render(props: DeckProps) {
        return (
            <Fragment>
            <label for="deck">
                Deck:
            </label>
            <select name="deck" onInput={props.onInput} value={props.curDeck}>
                {props.decks.map(deck => <option value={deck}>{deck}</option>)}
            </select>
            </Fragment>
        );
    }
}
