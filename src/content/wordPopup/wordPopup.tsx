import { h, Component, createRef } from "preact";
import WordDefinition from './WordDefinition';
import CardCreator from './CardCreator';
import { TemplateData, ShouldExpandText } from './Card/cardTemplate';
import css from './wordPopupStyle.css';

type Position = {
    x: number,
    y: number
}

interface WordPopupState {
    word: string,
    definition: string,
    sentence: string,
    pageTitle: string,
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
            pageTitle: document.title,
            locale: "en",
            spinning: false,
            isVisible: false,
            createCardIsVisible: false,
            wordDefinitionIsVisible: true,
            position: { x: 0, y: 0 }
        };
        window.addEventListener('click', (e: MouseEvent) => this.hideOnOutsideClick(e));
        window.addEventListener('dblclick', (e: MouseEvent) => this.handleWordClick(e));
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

    extractSentence = (textSelection: Selection): string => {
        let sentence = "";
        const separators = /[.!?]/;

        // first sentence half
        let separatorFound = false;
        let node = textSelection.anchorNode;
        if (node == null || node.textContent == null) return "";
        let text = node.textContent.slice(0, window.getSelection()!.anchorOffset);
        while (!separatorFound) {
            for (const char of text.split('').reverse().join('')) {
                sentence = char + sentence;
                if (char.match(separators)) {
                    sentence = sentence.slice(2);
                    separatorFound = true;
                    break;
                }
            }
            node = node.previousSibling;
            if (!node)
                break;
            if (node.textContent)
                text = node.textContent;
        }
        // second sentence half
        separatorFound = false;
        node = textSelection.anchorNode;
        if (node == null || node.textContent == null) return sentence;
        text = node.textContent.slice(window.getSelection()!.anchorOffset);
        while (!separatorFound) {
            for (const char of text) {
                sentence = sentence + char;
                if (char.match(separators)) {
                    separatorFound = true;
                    break;
                }
            }
            node = node.nextSibling;
            if (!node)
                break;
            if (node.textContent)
                text = node.textContent;
        }
        return sentence;
    }

    getDefinition = async (word: string, locale: string): Promise<Pick<WordPopupState, 'word' | 'definition' | 'spinning'>> => {
        this.setState({ spinning: true });
        try {
            const message = await browser.runtime.sendMessage({
                action: "lookup-word",
                word: word,
                langcode: locale,
            });
            return {
                word: word,
                definition: message.response,
                spinning: false,
            };
        }
        catch (error) {
            return {
                word: word,
                definition: `Error: ${error}`,
                spinning: false
            };
        }
    }

    updateDefinition = (word: string, locale: string): void => {
        this.getDefinition(word, locale).then(stateDefinition => {
            this.setState(stateDefinition);
        })
    }

    handleWordClick = (e: MouseEvent): void => {
        if (e.altKey) {
            this.setPositionRelMouse(e.pageX, e.pageY);
            const selection = window.getSelection();
            const selectedWord = selection!.toString();
            const sentence = selection ? this.extractSentence(selection) : "";
            const locale = document.documentElement.lang;
            this.getDefinition(selectedWord, locale).then(definitionState => {
                this.setState({
                    ...definitionState,
                    isVisible: true,
                    wordDefinitionIsVisible: true,
                    createCardIsVisible: false,
                    sentence: sentence
                });
            });
        }
    }

    getStateTemplateData = (state: WordPopupState): TemplateData => {
        return {
            word: state.word,
            sentence: state.sentence,
            definition: state.definition,
            title: state.pageTitle
        };
    };

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
            <div id={css.popupDictionaryWindow} ref={this.popupDictionaryWindowRef} style={style}>
                {state.wordDefinitionIsVisible ?
                    <WordDefinition word={state.word}
                        definition={state.definition}
                        sentence={state.sentence}
                        locale={state.locale}
                        spinning={state.spinning}
                        updateDefinition={this.updateDefinition}
                        onCreateCard={this.showCreateCard} />
                    : null}
                {state.createCardIsVisible ? <CardCreator expand={ShouldExpandText.Yes} templateData={this.getStateTemplateData(state)} /> : null}
            </div>
        );
    }
}
