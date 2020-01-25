import { wiktionaryQueryWordFormatted } from './wiktionary';

async function handleWordLookup(word: string, sourceLocale: string) {
    try {
        const definition = await wiktionaryQueryWordFormatted(word, sourceLocale);
        return definition;
    }
    catch (error) {
        throw error;
    }
}

export default handleWordLookup;
