import Config from './Config';

/**
 * Gets the text for a given definition ID for the selected language from the text definitions
 * catalogue. Defaults to English if the definition is not found in the selected language.
 */
function getTextDef(definitionId: string) {
    if (!Config.TextDefs[Config.language]) return 'Unsupported language.';

    let text = Config.TextDefs[Config.language][definitionId];
    // Check if definition is defined for selected language.
    if (text) return text;

    // Use English instead as a fallback.
    text = Config.TextDefs.English[definitionId];

    if (text) return text;

    // Check if the text def is even defined for English, which it should be is if it is valid.
    return `??? ${definitionId} ???`;
}

export default getTextDef;
