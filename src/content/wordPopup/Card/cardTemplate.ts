import getSetting from '../../../common/getSetting';

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

const saveTemplate = (noteType: string, fields: Field[]) => {
    getSetting("cardTemplates").then((cardTemplates) => {
        (cardTemplates as Template)[noteType] = fields;
        browser.storage.sync.set({
            cardTemplates: cardTemplates as browser.storage.StorageValue
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
    const templates = await getSetting("cardTemplates") as Template;

    if (!templates.hasOwnProperty(modelName)) return fields;
    return templates[modelName].map(({ name, value }: Field): Field => {
        return { name: name, value: expand === ShouldExpandText.Yes ? evalTemplate(value, templateData) : value };
    })
}

export { insertFieldTemplates, Template, TemplateData, Field, saveTemplate, ShouldExpandText };
