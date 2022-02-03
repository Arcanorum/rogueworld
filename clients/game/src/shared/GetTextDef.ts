import Config from './Config';

/**
 * Gets the text for a given definition ID for the selected language from the text definitions catalogue.
 * Defaults to English if the definition is not found in the selected language.
 */
function getTextDef(definitionID: string) {
    if(!Config.TextDefs[Config.language]) return 'Unsupported language. This looks like a bug. :/';

    const text = Config.TextDefs[Config.language][definitionID];
    // Check if definition is defined for selected language.
    if (text === null) {
        // Use English instead.
        return Config.TextDefs.English[definitionID];
    }
    // Check if the text def is even defined.
    if (text === undefined) return `??? ${definitionID} ???`;
    // Return the text, in the selected language.
    return text;
}

export default getTextDef;
