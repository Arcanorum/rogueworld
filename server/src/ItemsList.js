
const ItemsList = {
    LIST: this
};

// Import all of the item files.
require('require-dir')('items', {
    recurse: true,
    mapKey: (value, baseName) => {
        if(typeof value === "function"){
            // Only add things that are actual items (has "Item" prefix), not superclasses.
            // Also catch the "Item" class itself.
            if(baseName.substring(0, 4) !== "Item" || baseName === "Item") return;

            ItemsList[baseName] = value;
        }
    }
});

// Check all of the items are valid. i.e. are a class/function.
Object.keys(ItemsList).forEach((itemKey) => {
    // Skip the list itself.
    if(itemKey === "LIST") return;

    if(typeof ItemsList[itemKey] !== "function"){
        console.error("* ERROR: Invalid item type added to ItemsList:", itemKey);
        process.exit();
    }
});

// Write the registered item types to the client, so the client knows what item to add for each type number.
const fs = require('fs');
let dataToWrite = {};

for(let itemTypeKey in ItemsList){
    // Don't check prototype properties.
    if(ItemsList.hasOwnProperty(itemTypeKey) === false) continue;

    const itemPrototype = ItemsList[itemTypeKey].prototype;
    // Catches the LIST reference thing that is set up at the end of server init, which won't have a type number at all.
    if(itemPrototype === undefined) continue;
    // Only add registered types.
    if(itemPrototype.typeNumber === 'Type not registered.') continue;
    // Add this item type to the type catalogue.
    dataToWrite[itemPrototype.typeNumber] = {
        typeNumber: itemPrototype.typeNumber,
        idName: itemPrototype.idName,
        baseValue: itemPrototype.baseValue,
        iconSource: itemPrototype.iconSource
    };
}

// Turn the data into a string.
dataToWrite = JSON.stringify(dataToWrite);

// Write the data to the file in the client files.
fs.writeFileSync('../client/src/catalogues/ItemTypes.json', dataToWrite);

console.log("* Item types catalogue written to file.");

module.exports = ItemsList;
