const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const Utils = require("./Utils");
const EntitiesList = require("./EntitiesList");

const populateList = () => {
    Utils.message("Populating entities list.");

    // Import all of the entity files.
    // eslint-disable-next-line global-require
    require("require-dir")("entities", {
        recurse: true,
        mapKey: (value, baseName) => {
            if (typeof value === "function") {
                if (EntitiesList[baseName]) {
                    Utils.error(`Cannot load entity "${baseName}", as it already exists in the entities list.`);
                }
                // Don't do any additional setup for abstract classes.
                // Only bother with classes that are actually going to get instantiated.
                if (Object.prototype.hasOwnProperty.call(value, "abstract")) {
                    EntitiesList.AbstractClasses[baseName] = value;
                    return;
                }

                value.registerEntityType();

                EntitiesList[baseName] = value;
            }
        },
    });

    // try {
    //     // Load all of the mob configs.
    //     const mobConfigs = yaml.safeLoad(
    //         fs.readFileSync(
    //             path.resolve("./src/configs/ItemValues.yml"), "utf8",
    //         ),
    //     );

    //     mobConfigs.forEach((config) => {
    //         // Only generate a class for this entity if one doesn't already
    //         // exist, as it might have it's own special logic file.
    //         if (!EntitiesList[config.name]) {
    //             EntitiesList[config.name] = makeClass(config);
    //         }
    //     });
    // }
    // catch (error) {
    //     Utils.error(error);
    // }

    Utils.message("Finished populating entities list.");
};

const initialiseList = () => {
    Utils.message("Initialising entities list.");

    // Mobs.
    EntitiesList.AbstractClasses.Mob.loadConfigs();

    // Resource nodes.
    EntitiesList.AbstractClasses.ResourceNode.loadConfigs();

    Utils.message("Finished initialising entities list. EntitiesList is ready to use.");
};

const createCatalogue = () => {
    // Write the registered entity types to the client, so the client knows what entity to add for each type number.
    let dataToWrite = {};

    Object.entries(EntitiesList).forEach(([entityTypeKey, EntityType]) => {
        if (entityTypeKey === "AbstractClasses") return;
        // Only add registered types.
        if (!EntitiesList[entityTypeKey].prototype.typeNumber) {
            Utils.error("Entity type is missing a type number:", EntityType);
        }

        // Add this entity type to the type catalogue.
        dataToWrite[EntityType.prototype.typeNumber] = entityTypeKey;
    });

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
