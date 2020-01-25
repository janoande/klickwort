import { h, Component, Fragment } from 'preact';
import { Language } from 'langs';

interface IProps {
    onInput: (e: Event) => void,
    languages: Language[],
    curLang: string
}

export default class TargetLang extends Component<IProps, any> {
    render(props: IProps, _state: any) {
        return (
            <Fragment>
                <label>Target language for translator: </label>
                <select name="selectLang" onInput={props.onInput} value={props.curLang}>
                    {props.languages.map((lang: Language) => <option value={lang.name}>{lang.name}</option>)}
                </select>
            </Fragment>
        );
    };
}
