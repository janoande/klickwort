import { h, Component } from 'preact';

interface NoteTypeProps {
    onInput: (e: any) => void,
    curNoteType: string,
    models: string[]
}

export default class Deck extends Component<NoteTypeProps> {
    render(props: NoteTypeProps) {
        return (
            <label>
                Note type:
                <select name="noteType" onInput={props.onInput} value={props.curNoteType}>
                    {props.models.map(noteType => <option value={noteType}>{noteType}</option>)}
                </select>
            </label>
        );
    }
}
