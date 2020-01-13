import { h, Component, createRef } from 'preact';
const langs = require('langs');
import css from './wordPopupStyle.css';

interface WordDefinitionProps {
    word: string,
    definition: string,
    sentence: string,
    locale: string,
    spinning: boolean,
    updateDefinition: (word: string, locale: string, sentence?: string | undefined) => void,
    onCreateCard: () => void
}

interface WordDefinitionState {
}

export default class WordDefinition extends Component<WordDefinitionProps, WordDefinitionState> {
    private definitionTextRef = createRef();

    constructor(props: WordDefinitionProps) {
        super(props);
    }

    componentDidUpdate(prevProps: WordDefinitionProps) {
        if (prevProps.definition !== this.props.definition) {
            this.fixPopupLinks();
        }
    }

    langNameToLocale = (langName: string): string => {
        if (langName === "" || !langs.has("name", langName))
            return "en";
        return langs.where("name", langName)["1"];
    }

    fixPopupLinks = (): void => {
        this.definitionTextRef.current.querySelectorAll("a").forEach((elem: HTMLAnchorElement) => {
            const url = new URL(elem.href);
            const langName = url.hash.slice(1);
            const locale = this.langNameToLocale(langName);
            const path = url.pathname;
            const word = path.split("/")[path.split("/").length - 1];
            elem.onclick = (e) => {
                e.preventDefault()
                if (word === "Appendix:Glossary") return;
                this.props.updateDefinition(word, locale);
            };
        });
    }

    render(props: WordDefinitionProps, _state: WordDefinitionState) {
        return (
            <div>
                <div id={css.popupDictionaryWindowText}>
                    Definition for <b>{props.word}</b>: <br />
                    {props.spinning && <div id={css.popupDictSpinner}></div>}
                    <span ref={this.definitionTextRef}
                        dangerouslySetInnerHTML={{ __html: props.definition }}>
                    </span>
                </div>
                <button onClick={props.onCreateCard}>Create card</button>
            </div>
        );
    }
}

