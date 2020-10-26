const fs = require("fs");
const Utils = require("./Utils");
const EntitiesList = require("./EntitiesList");

// Import all of the entity files.
require("require-dir")("entities", {
    recurse: true,
    mapKey: (value, baseName) => {
        if (typeof value === "function") {
            // Don't do any additional setup for abstract classes.
            // Only bother with classes that are actually going to get instantiated.
            if(value.hasOwnProperty("abstract")) return;

            value.registerEntityType();
            
            if(value.assignMobValues) value.assignMobValues();

            EntitiesList[baseName] = value;
        }
    }
});

// Write the registered entity types to the client, so the client knows what entity to add for each type number.
let dataToWrite = {};

for (let entityTypeKey in EntitiesList) {
    // Don't check prototype properties.
    if (EntitiesList.hasOwnProperty(entityTypeKey) === false) continue;
    // Only add registered types.
    if (EntitiesList[entityTypeKey].prototype.typeNumber === "Type not registered.") continue;
    // Add this entity type to the type catalogue.
    dataToWrite[EntitiesList[entityTypeKey].prototype.typeNumber] = entityTypeKey;
}

// Turn the data into a string.
dataToWrite = JSON.stringify(dataToWrite);

Utils.checkClientCataloguesExists();

// Write the data to the file in the client files.
fs.writeFileSync("../client/src/catalogues/EntityTypes.json", dataToWrite);

Utils.message("Entity types catalogue written to file.");

module.exports = EntitiesList;
