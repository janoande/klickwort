import { h, Component, createRef } from "preact";
import WordDefinition from './WordDefinition';
import CardCreator from './CardCreator';

type Position = {
    x: number,
    y: number
}

interface WordPopupState {
    word: string,
    definition: string,
    sentence: string,
    locale: string,
    spinning: boolean,
    isVisible: boolean,
    createCardIsVisible: boolean,
    wordDefinitionIsVisible: boolean,
    position: Position
}

export default class WordPopup extends Component {
    private popupDictionaryWindowRef = createRef();

    constructor(props: any) {
        super(props);
        this.state = {
            word: "cat",
            definition: "Felis silvestris catus",
            sentence: "This cat has a hat.",
            locale: "en",
            spinning: false,
            isVisible: false,
            createCardIsVisible: false,
            wordDefinitionIsVisible: true,
            position: { x: 0, y: 0 }
        };
        window.addEventListener('click', this.hideOnOutsideClick);
        window.addEventListener('dblclick', this.handleWordClick);
    }

    public setPositionRelMouse = (mouseX: number, mouseY: number): void => {
        const popupElement = this.popupDictionaryWindowRef.current;
        if (!popupElement) return;

        let position: Position = { x: 0, y: 0 };
        const offset = 20;
        position.y = (mouseY + offset);

        const clientWidth = document.documentElement.clientWidth;
        const style = getComputedStyle(popupElement);
        const widthRules = ["width", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"];
        const popupWidth = widthRules.reduce((acc: number, cur: string) => {
            // @ts-ignore
            return acc + parseFloat(style[cur]);
        }, 0);
        position.x = Math.max(Math.min((mouseX - popupWidth / 2), clientWidth - popupWidth), 0);

        this.setState({ position: position });
    }

    hideOnOutsideClick = (e: Event): void => {
        const popupElement = this.popupDictionaryWindowRef.current;
        if (!popupElement) return;
        if (e) {
            let target = e.target;
            if (target instanceof Element && !popupElement.contains(target) && document.body.contains(target))
                this.setState({ isVisible: false });
        }
    }

    updateDefinition = (word: string, locale: string, sentence?: string): void => {
        this.setState({ spinning: true });
        browser.runtime.sendMessage({
            action: "lookup-word",
            word: word,
            langcode: locale,
        }).then((message) => {
            this.setState({
                word: word,
                definition: message.response,
                spinning: false
            });
            if (sentence) {
                this.setState({
                    sentence: sentence
                });
            }
        },
            (error) => {
                this.setState({
                    word: word,
                    definition: `Error: ${error}`,
                    spinning: false
                });
            });
    }

    handleWordClick = (e: MouseEvent): void => {
        if (e.altKey) {
            this.setPositionRelMouse(e.pageX, e.pageY);
            const selectedWord = window.getSelection()!.toString();
            const locale = document.documentElement.lang;
            this.updateDefinition(selectedWord, locale);
            this.setState({
                isVisible: true,
                wordDefinitionIsVisible: true,
                createCardIsVisible: false
            });
        }
    }

    showCreateCard = () => {
        browser.runtime.sendMessage({ action: "anki-check-version" }).then(response => {
            if (response.error) {
                alert("Error when connecting to Anki:\n" + response.error + "\n\nPlease ensure that Anki is currently running.");
            }
            else {
                this.setState({
                    createCardIsVisible: true,
                    wordDefinitionIsVisible: false
                });
            }
        });
    };

    render(_props: any, state: WordPopupState) {
        const style = {
            top: state.position.y + "px",
            left: state.position.x + "px",
            display: state.isVisible ? "block" : "none"
        };
        return (
            <div id="popupDictionaryWindow" ref={this.popupDictionaryWindowRef} style={style}>
                {state.wordDefinitionIsVisible ? <WordDefinition word={state.word}
                    definition={state.definition}
                    sentence={state.sentence}
                    locale={state.locale}
                    spinning={state.spinning}
                    updateDefinition={this.updateDefinition}
                    onCreateCard={this.showCreateCard} />
                    : null}
                {state.createCardIsVisible ? <CardCreator /> : null}
            </div>
        );
    }
}
