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
            const version = { expected: this.version, got: await this.query("version") };
            return version;
        }
        catch (e) {
            throw e;
        }
    }

    static async fetchDecks() {
        const decks = await this.query("deckNames");
        return decks;
    }

    static async fetchModelNames() {
        const models = await this.query("modelNames");
        return models;
    }

    static async fetchFields(modelName: string) {
        const fields = await this.query("modelFieldNames", {
            "modelName": modelName
        });
        return fields;
    }

    static async pushCard(deckName: string, modelName: string, fields: string[], tags = []) {
        return Anki.query("addNote", {
            "note": {
                "deckName": deckName,
                "modelName": modelName,
                "fields": fields,
                "options": {
                    "allowDuplicates": false
                },
                "tags": tags
            }
        });
    }
}
// TODO: may be used for rules
//             "Back": `${this.definition} <p>${this.title}<br/>${this.sentence}</p>`
//             "Text": this.sentence.replace(new RegExp(this.word, 'g'), `{{c1::${this.word}}}`),

export { Anki };
