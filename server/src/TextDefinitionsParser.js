
// Parse and convert the text translations file into easily accessible JSON.
// Text definitions are defined at https://docs.google.com/spreadsheets/d/1n6jSigPBWrubNQMTz00GsLIh3U8CMtfZH8wMFYmfHaA/edit#gid=0

const XLSX = require('xlsx');
const fs = require('fs');

// Check the translations source exists. Might be the deployment server, which doesn't need the source.
if(fs.existsSync('Dungeonz.io translations.xlsx') === true){

    const workbook = XLSX.readFile('Dungeonz.io translations.xlsx');

    const firstSheetName = workbook.SheetNames[0];
    // Get the worksheet.
    const worksheet = workbook.Sheets[firstSheetName];
    // Some characters to loop though, to go across the columns.
    const chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
    let defsAsJSON = {};
    const idNameCol = 'A';
    // The row that the language names are on.
    const languageNameRow = 8;
    // The row that the first definition is on for each column.
    const firstDefRow = 9;
    // The current row being accessed.
    let currentDefRow = 9;
    // The index of the column character in the chars array for the current language. Incremented as the languages are gone through.
    let currentLanguageCharIndex = 1;
    // The value of that index in the chars array.
    let currentLanguageCol = chars[currentLanguageCharIndex];
    // The name of the language i.e. 'English', 'French'.
    let currentLanguageName = worksheet[currentLanguageCol + languageNameRow].v;
    // An object of the text defs that have been added to the current language so far.
    let currentLanguageDefs;

    // Add an object for the current language.
    defsAsJSON[currentLanguageName] = {};

    while(true){
        //console.log("row:", currentDefRow, "ID:", worksheet[idNameCol + currentDefRow].v, "lang col:", currentLanguageCol, "current lang:", currentLanguageName);

        // Check if this language is valid. The previous one might have been the last one, in which case end.
        if(currentLanguageName === undefined) break;

        // Shorthand.
        currentLanguageDefs = defsAsJSON[currentLanguageName];

        // Add the ID name as a key. Null by default, value added if found.
        currentLanguageDefs[worksheet[idNameCol + currentDefRow].v] = null;

        // Check there is a value at this row for the current language.
        if(worksheet[currentLanguageCol + currentDefRow] !== undefined){
            // Add the value.
            currentLanguageDefs[worksheet[idNameCol + currentDefRow].v] = worksheet[currentLanguageCol + currentDefRow].v;
        }

        // Go down a row to the next definition.
        currentDefRow += 1;

        // Check there is another ID to add at the next field.
        if(worksheet[idNameCol + currentDefRow] === undefined){
            // At the end of the definitions, so try the next language.

            // Get the language column character along.
            currentLanguageCharIndex += 1;
            currentLanguageCol = chars[currentLanguageCharIndex];

            // Check if there is another language. The previous one might have been the last one, in which case end.
            if(worksheet[currentLanguageCol + languageNameRow] === undefined) break;

            // Get the name of the language.
            currentLanguageName = worksheet[currentLanguageCol + languageNameRow].v;

            // Add an object for the current language.
            defsAsJSON[currentLanguageName] = {};

            // Go back up to the first definition row so it can start looping down again.
            currentDefRow = firstDefRow;
        }

    }

    // Write the text defs to the client.
    let dataToWrite = {};

    // Turn the data into a string.
    dataToWrite = JSON.stringify(defsAsJSON);

    // Write the data to the file in the client files.
    fs.writeFileSync('../client/src/catalogues/TextDefinitions.json', dataToWrite);

    console.log("* Text definitions catalogue written to file.");

}
