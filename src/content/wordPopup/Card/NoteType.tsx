import { h, Component, Fragment } from 'preact';

interface NoteTypeProps {
    onInput: (e: any) => void,
    curNoteType: string,
    models: string[]
}

export default class Deck extends Component<NoteTypeProps> {
    render(props: NoteTypeProps) {
        return (
            <Fragment>
                <label for="noteType">
                    Note type:
                </label>
                <select name="noteType" onInput={props.onInput} value={props.curNoteType}>
                    {props.models.map(noteType => <option value={noteType}>{noteType}</option>)}
                </select>
            </Fragment>
        );
    }
}
