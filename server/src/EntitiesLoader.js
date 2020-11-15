const fs = require("fs");
const Utils = require("./Utils");
const EntitiesList = require("./EntitiesList");

const populateList = () => {
    Utils.message("Populating entities list.");

    // Import all of the entity files.
    require("require-dir")("entities", {
        recurse: true,
        mapKey: (value, baseName) => {
            if (typeof value === "function") {
                // Don't do any additional setup for abstract classes.
                // Only bother with classes that are actually going to get instantiated.
                if(value.hasOwnProperty("abstract")) {
                    EntitiesList.AbstractClasses[baseName] = value;
                    return;
                };

                value.registerEntityType();

                EntitiesList[baseName] = value;
            }
        }
    });

    Utils.message("Finished populating entities list.");
};

const initialiseList = () => {
    Utils.message("Initialising entities list.");

    const Mob = require("./entities/destroyables/movables/characters/mobs/Mob");

    Mob.loadMobStats();

    Object.values(EntitiesList).forEach((EntityType) => {
        if(EntityType.assignMobValues) EntityType.assignMobValues();
    });

    Utils.message("Finished initialising entities list. EntitiesList is ready to use.");
};

const createCatalogue = () => {
    // Write the registered entity types to the client, so the client knows what entity to add for each type number.
    let dataToWrite = {};

    for (let entityTypeKey in EntitiesList) {
        if(entityTypeKey === "AbstractClasses") continue;
        // Don't check prototype properties.
        if (EntitiesList.hasOwnProperty(entityTypeKey) === false) continue;
        // Only add registered types.
        if (EntitiesList[entityTypeKey].prototype.typeNumber === "Type not registered.") continue;
        // Add this entity type to the type catalogue.
        dataToWrite[EntitiesList[entityTypeKey].prototype.typeNumber] = entityTypeKey;
    }

    dataToWrite = JSON.stringify(dataToWrite);

    Utils.checkClientCataloguesExists();

    // Write the data to the file in the client files.
    fs.writeFileSync("../client/src/catalogues/EntityTypes.json", dataToWrite);

    Utils.message("Entity types catalogue written to file.");
};

module.exports = {
    populateList,
    initialiseList,
    createCatalogue,
};
