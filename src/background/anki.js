const url = "http://localhost:8765/";
const ankiConnectVersion = 6;

async function ankiQuery(action, params={}) {
    const query = {
        "action" : action,
        "version" : ankiConnectVersion,
        "params": params
    };

    return fetch(url, {
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

async function ankiCheckVersion() {
    const version = await ankiQuery("version");
    if (version === ankiConnectVersion)
        console.log("Anki-connect version", ankiConnectVersion, "found. OK");
    else
        console.log("Anki-connect version", version, " !=", ankiConnectVersion, "found. WARNING");
}

function ankiAddBasicNote(deckName, frontContent, backContent) {
    return ankiQuery("addNote", {
        "note" : {
           "deckName": deckName,
           "modelName": "Basic",
           "fields": {
               "Front": frontContent,
               "Back": backContent
           },
           "options": {
               "allowDuplicates": false
           },
           "tags": [
               "firefox-cards"
           ]
        } 
    });
}


export { ankiCheckVersion, ankiAddBasicNote };
