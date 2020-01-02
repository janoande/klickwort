interface templateData {
    [key: string]: string
}

interface Field {
    fieldName: string,
    fieldTemplate: string
}

interface Template {
    [model: string]: Array<Field>
}

let cardTemplates = {
    "Basic": [
        { fieldName: "Front", fieldTemplate: "${word}" },
        { fieldName: "Back", fieldTemplate: "${definition} <p>${title}<br/>${sentence}</p>" }
    ],
    "Cloze": [
        { fieldName: "Text", fieldTemplate: "${sentence.replace(new RegExp(word, 'g'), `{{c1::${word}}}`)}" },
        { fieldName: "Extra", fieldTemplate: "Extra text here" }
    ]
}

const evalTemplate = (text: string, { word, sentence, definition, title }: templateData) => {
    return eval("`" + text + "`");
}

/**
  * Returns the fields for a given card model with info given by data
  * according to the template config.
  * @param modelName the name of the model
  * @param data object with data for word, definition, etc.
  * @param templates object with templates for each card model and fields
  * @returns array of card fields with values inserted as per template config
  */
const getCardTemplate = (modelName: string, data: templateData, templates: Template): Field[] => {
    if (!templates.hasOwnProperty(modelName)) return [];
    return templates[modelName].map((field: Field): Field => {
        field.fieldTemplate = evalTemplate(field.fieldTemplate, data);
        return field;
    });
}

export { getCardTemplate, templateData, cardTemplates };
