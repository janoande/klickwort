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

let cardTemplates: Template = {
    "Basic": [
        { name: "Front", value: "${word}" },
        { name: "Back", value: "${definition} <p><b>${title}</b><br/>${sentence}</p>" }
    ],
    "Cloze": [
        { name: "Text", value: "${sentence.replace(new RegExp(word, 'g'), `{{c1::${word}}}`)}" },
        { name: "Extra", value: "Extra text here" }
    ]
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
  * @param templates object with templates for each card model and fields
  * @returns array of card fields with values inserted as per template config
  */
const insertFieldTemplates = (modelName: string, fields: Field[], templateData: TemplateData, templates = cardTemplates): Field[] => {
    if (!templates.hasOwnProperty(modelName)) return fields;
    return templates[modelName].map(({ name, value }): Field => {
        return { name: name, value: evalTemplate(value, templateData) };
    })
}

export { insertFieldTemplates, TemplateData, cardTemplates, Field };
