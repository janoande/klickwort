class Anki {
    static get url() { return "http://localhost:8765/"; }
    static get version() { return 6; }

    static query(action: string, params = {}) {
        const query = {
            "action": action,
            "version": this.version,
            "params": params
        };
        return fetch(this.url, {
            method: "POST",
            body: JSON.stringify(query),
        }).then((response) => {
            if (response.ok) {
                return response.json().then(json => {
                    if (json.error) throw new Error(json.error);
                    return json.result;
                }).catch(error => {
                    return Promise.reject(new Error(error.message));
                });
            }
        }).catch(error => {
            return Promise.reject(new Error(error.message));
        });
    }

    static async checkVersion() {
        const version = await this.query("version");
        if (version === this.version)
            console.log("Anki-connect version", version, "found. OK");
        else
            console.log("Anki-connect version", version, " !=", this.version, "found. WARNING");
    }
}

class AnkiCard {
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
    word: string;
    sentence: string;
    definition: string;
    title: string;

    constructor() {
        super();
        this.word = "";
        this.sentence = "";
        this.definition = "";
        this.title = "";
    }

    setWord(word: string) {
        this.word = word;
        return this;
    }
    setSentence(sentence: string) {
        this.sentence = sentence;
        return this;
    }
    setDefinition(definition: string) {
        this.definition = definition;
        return this;
    }
    setTitle(title: string) {
        this.title = title;
        return this;
    }
    formatCard() {
        return {
            "Front": this.word,
            "Back": `${this.definition} <p>${this.title}<br/>${this.sentence}</p>`
        };
    }
    push(deckName: string) {
        return super.push(deckName, "Basic", this.formatCard())
    }
}

class AnkiClozeCard extends AnkiCard {
    word: string;
    sentence: string;
    extra: string;

    constructor() {
        super();
        this.word = "";
        this.sentence = "";
        this.extra = "";
    }

    setWord(word: string) {
        this.word = word;
        return this;
    }
    setSentence(sentence: string) {
        this.sentence = sentence;
        return this;
    }
    setExtra(extra: string) {
        this.extra = extra;
        return this;
    }
    formatCard() {
        return {
            "Text": this.sentence.replace(new RegExp(this.word, 'g'), `{{c1::${this.word}}}`),
            "Extra": this.extra || ""
        };
    }
    push(deckName: string) {
        return super.push(deckName, "Cloze", this.formatCard())
    }
}

export { Anki, AnkiBasicCard, AnkiClozeCard };
