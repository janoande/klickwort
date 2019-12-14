const url = "http://localhost:8765/";
const ankiConnectVersion = 6;

async function ankiQuery(action, params={}) {
    try {
        const query = {
            "action" : action,
            "version" : ankiConnectVersion,
            "params": params
        };
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(query),
        });
        const json = await response.json();
        if (json.error)
            throw json.error;
        return json.result;
    }
    catch (error) {
        console.error("Error:", error);
    }
}

async function ankiCheckVersion() {
    const version = await ankiQuery("version");
    if (version === ankiConnectVersion)
        console.log("Anki-connect version", ankiConnectVersion, "found. OK");
    else
        console.log("Anki-connect version", version, " !=", ankiConnectVersion, "found. WARNING");
}

function ankiCreateCard(word, sentence) {
    console.log("Creating card for word \"" + word +"\" in sentence \"" + sentence + "\".");
}


export { ankiCheckVersion, ankiCreateCard };
