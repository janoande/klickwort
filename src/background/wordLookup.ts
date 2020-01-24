import { wiktionaryQueryWordFormatted } from './wiktionary';

async function handleWordLookup(word: string, locale: string) {
    try {
        const definition = await wiktionaryQueryWordFormatted(word, locale);
        return definition;
    }
    catch (error) {
        throw error;
    }
}

export default handleWordLookup;
