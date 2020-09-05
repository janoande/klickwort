# Lingorino

Lingorino is a web-extension created for language learners. It packages a great tool-set consisting of a quickly accessible dictionary, text selection translation and customizable flashcard creation. These tools makes it easy to look up unknown words and sentences with the added benefit of being able to store and revise them later on.

## Features

- Word dictionary that popups when a word is double clicked while holding down Alt. The definitions are fetched from Wiktionary.
- Anki card creation based on the selected word. Set the deck, card type, and more.
- Templates for Anki cards, editable in the addon's settings page.
- Context menu items for translating highlighted text with a translator service in a new tab.

## Prerequisites

If you wish to create flashcards, then you will have to install the following:

- [Anki](https://apps.ankiweb.net/) - _the_ flashcard application.
- [AnkiConnect](https://ankiweb.net/shared/info/2055492159) - an Anki addon that allows communication to Anki over a REST API.

## Build & Run

Build with 
```npm run build```

Run with
```npm run webext```

An installable package is built with
```npm run package```

## Limitations

Languages with *scriptio continua* are not supported since Lingorino relies on spaces and punctuation to distinguish words and sentences from each other. 

## License

MIT
