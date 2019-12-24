abstract class Anki {

    private static readonly url = "http://localhost:8765/";
    private static readonly version = 6;

    private constructor() { }

    static async query(action: string, params = {}) {
        const query = {
            "action": action,
            "version": this.version,
            "params": params
        };
        try {
            let response = await fetch(this.url, {
                method: "POST",
                body: JSON.stringify(query),
            });
            if (response.ok) {
                let json = await response.json();
                if (json.error) throw new Error(json.error);
                return json.result;
            }
            else {
                throw new Error(`Network response error ${response.status}.`);
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    static async checkVersion() {
        try {
            const version = await this.query("version");
            if (version === this.version)
                console.log("Anki-connect version", version, "found. OK");
            else
                console.log("Anki-connect version", version, " !=", this.version, "found. WARNING");
        }
        catch (e) {
            console.log("Anki connection error:", e.message);
        }
    }
}

abstract class AnkiCard {
    push(deckName: string, modelName: string, fields: any) {
        return Anki.query("addNote", {
            "note": {
                "deckName": deckName,
                "modelName": modelName,
                "fields": fields,
                "options": {
                    "allowDuplicates": false
                },
                "tags": [
                    "firefox-cards"
                ]
            }
        });
    }
}

class AnkiBasicCard extends AnkiCard {
    private word: string;
    private sentence: string;
    private definition: string;
    private title: string;

    constructor() {
        super();
        this.word = "";
        this.sentence = "";
        this.definition = "";
        this.title = "";
    }

    setWord(word: string): this {
        this.word = word;
        return this;
    }
    setSentence(sentence: string): this {
        this.sentence = sentence;
        return this;
    }
    setDefinition(definition: string): this {
        this.definition = definition;
        return this;
    }
    setTitle(title: string): this {
        this.title = title;
        return this;
    }
    formatCard() {
        return {
            "Front": this.word,
            "Back": `${this.definition} <p>${this.title}<br/>${this.sentence}</p>`
        };
    }
    push(deckName: string): Promise<any> {
        return super.push(deckName, "Basic", this.formatCard())
    }
}

class AnkiClozeCard extends AnkiCard {
    private word: string;
    private sentence: string;
    private extra: string;

    constructor() {
        super();
        this.word = "";
        this.sentence = "";
        this.extra = "";
    }

    setWord(word: string): this {
        this.word = word;
        return this;
    }
    setSentence(sentence: string): this {
        this.sentence = sentence;
        return this;
    }
    setExtra(extra: string): this {
        this.extra = extra;
        return this;
    }
    formatCard() {
        return {
            "Text": this.sentence.replace(new RegExp(this.word, 'g'), `{{c1::${this.word}}}`),
            "Extra": this.extra || ""
        };
    }
    push(deckName: string): Promise<any> {
        return super.push(deckName, "Cloze", this.formatCard())
    }
}

export { Anki, AnkiBasicCard, AnkiClozeCard };
