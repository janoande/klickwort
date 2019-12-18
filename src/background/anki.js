class Anki {
    static get url() { return "http://localhost:8765/"; }
    static get version() { return 6; }

    static query(action, params={}) {
        const query = {
            "action" : action,
            "version" : this.version,
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
    push(deckName, modelName, fields) {
        return Anki.query("addNote", {
            "note" : {
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
    word(word) {
        this._word = word;
        return this;
    }
    sentence(sentence) {
        this._sentence = sentence;
        return this;
    }
    definition(definition) {
        this._definition = definition;
        return this;
    }
    title(title) {
        this._title = title;
        return this;
    }
    formatCard() {
        return {
            "Front": this._word,
            "Back": `${this._definition} <p>${this._title}<br/>${this._sentence}</p>`
        };
    }
    push(deckName) {
        return super.push(deckName, "Basic", this.formatCard())
    }
}

class AnkiClozeCard extends AnkiCard {
    word(word) {
        this._word = word;
        return this;
    }
    sentence(sentence) {
        this._sentence = sentence;
        return this;
    }
    extra(extra) {
        this._extra = extra;
        return this;
    }
    formatCard() {
        return {
            "Text": this._sentence.replace(new RegExp(this._word, 'g'), `{{c1::${this._word}}}`),
            "Extra": this._extra || ""
        };
    }
    push(deckName) {
        return super.push(deckName, "Cloze", this.formatCard())
    }
}

export { Anki, AnkiBasicCard, AnkiClozeCard };
