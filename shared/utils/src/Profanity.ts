type WordsList = Array<string>;

const regex = /\b/;
const placeHolder = '*';
const replaceRegex = /\w/g;

/**
 * Determine if a string contains profane language.
 */
const isProfane = (wordsList: WordsList, string: string) => {
    return wordsList
        .filter((word: string) => {
            const wordExp = new RegExp(`\\b${word.replace(/(\W)/g, '\\$1')}\\b`, 'gi');
            return wordExp.test(string);
        })
        .length > 0 || false;
};

/**
 * Replace a word with placeHolder characters.
 */
const replaceWord = (string: string) => {
    return string
        .replace(regex, '')
        .replace(replaceRegex, placeHolder);
};

/**
 * Evaluate a string for profanity and return an edited version.
 *
 * Takes in a pre-loaded list of words, as the environment where this is used may load the words
 * list file differently (i.e. loaded using a Webpack loader for the client vs loaded using fs in
 * NodeJS for the server).
 */
export const censorString = (wordsList: WordsList, string: string) => {
    return string.split(regex).map((word) => {
        return isProfane(wordsList, word) ? replaceWord(word) : word;
    }).join(regex.exec(string)![0]);
};
