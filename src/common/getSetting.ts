import { Template } from '../content/wordPopup/Card/cardTemplate';

type SettingsValue = string | Template;
type Settings = {
    [key: string]: SettingsValue,
};

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

const defaultSettings: Settings = {
    targetLanguage: "English",
    cardTemplates: defaultCardTemplates,
};

const getSetting = async (setting: string): Promise<SettingsValue> => {
    const settingObj = await browser.storage.sync.get(setting);
    return settingObj[setting] as SettingsValue || defaultSettings[setting];
}

export default getSetting;
