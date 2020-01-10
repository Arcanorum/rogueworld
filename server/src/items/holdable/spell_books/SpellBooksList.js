
const SpellBookList = {
    ItemBookOfLight: require('./ItemBookOfLight'),
    ItemBookOfSouls: require('./ItemBookOfSouls'),
};


// Write the registered spell book types to the client, so the client knows what spell book data to use for each type number.
const fs = require('fs');
let dataToWrite = {};

for(let itemTypeKey in SpellBookList){
    // Don't check prototype properties.
    if(SpellBookList.hasOwnProperty(itemTypeKey) === false) continue;

    const itemPrototype = SpellBookList[itemTypeKey].prototype;
    // Only add registered spell books.
    if(itemPrototype.spellBookTypeNumber === 'Spell book type not registered.') continue;
    // Add this spell book type to the type catalogue.
    dataToWrite[itemPrototype.spellBookTypeNumber] = {
        spellBookTypeNumber: itemPrototype.spellBookTypeNumber,
        spell1IdName: itemPrototype.spell1IdName,
        spell2IdName: itemPrototype.spell2IdName,
        spell3IdName: itemPrototype.spell3IdName,
        spell4IdName: itemPrototype.spell4IdName,
        spell1IconSource: itemPrototype.spell1IconSource,
        spell2IconSource: itemPrototype.spell2IconSource,
        spell3IconSource: itemPrototype.spell3IconSource,
        spell4IconSource: itemPrototype.spell4IconSource
    };
}

// Turn the data into a string.
dataToWrite = JSON.stringify(dataToWrite);

require('../../../Utils').checkClientCataloguesExists();

// Write the data to the file in the client files.
fs.writeFileSync('../client/src/catalogues/SpellBookTypes.json', dataToWrite);

console.log("* Spell book types catalogue written to file.");
