interface TemplateData {
    word: string,
    sentence: string,
    definition: string,
    title: string
}

interface Field {
    name: string,
    value: string
}

interface Template {
    [model: string]: Array<Field>
}

enum ShouldExpandText {
    No = 0,
    Yes = 1
}

let defaultCardTemplates: Template = {
    "Basic": [
        { name: "Front", value: "${word}" },
        { name: "Back", value: "${definition} <p><b>${title}</b><br/>${sentence}</p>" }
    ],
    "Cloze": [
        { name: "Text", value: "${sentence.replace(new RegExp(word, 'g'), `{{c1::${word}}}`)}" },
        { name: "Extra", value: "Extra text here" }
    ]
}

const getTemplates = (): Promise<{ cardTemplates: Template }> => {
    return browser.storage.sync.get("cardTemplates") as unknown as Promise<{ cardTemplates: Template }>;
}

const saveTemplate = (noteType: string, fields: Field[]) => {
    alert("fields: " + JSON.stringify(fields));
    // @ts-ignore
    getTemplates().then(({ cardTemplates }): void => {
        if (!cardTemplates)
            cardTemplates = defaultCardTemplates;
        // @ts-ignore
        alert("cardTemplates: " + JSON.stringify(cardTemplates));
        cardTemplates[noteType] = fields;
        browser.storage.sync.set({
            // @ts-ignore
            cardTemplates: cardTemplates
        });
    });
}

const evalTemplate = (text: string, { word, sentence, definition, title }: TemplateData) => {
    return eval("`" + text + "`");
}

/**
  * Returns the fields for a given card with template data inserted according to
  * the template config.
  * @param modelName the name of the model
  * @param fields contains the model's fields (name, value pairs)
  * @param data object with data for word, definition, etc. to use in the template
  * @param expand whether to expand the template or not
  * @param templates object with templates for each card model and fields
  * @returns array of card fields with values inserted as per template config
  */
const insertFieldTemplates = async (modelName: string, fields: Field[], templateData: TemplateData, expand: ShouldExpandText): Promise<Field[]> => {
    let tmp = await getTemplates();
    let templates = tmp.cardTemplates;
    if (templates == null || templates == undefined) templates = (defaultCardTemplates as Template);

    if (!templates.hasOwnProperty(modelName)) return fields;
    return templates[modelName].map(({ name, value }): Field => {
        return { name: name, value: expand === ShouldExpandText.Yes ? evalTemplate(value, templateData) : value };
    })
}

export { insertFieldTemplates, TemplateData, Field, saveTemplate, ShouldExpandText };
