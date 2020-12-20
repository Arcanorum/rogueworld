const fs   = require("fs");
const yaml = require("js-yaml");
const Utils = require("./Utils");
const ItemsList = require("./ItemsList");
const Item = require("./items/Item");

/**
 * Creates a generic class for an item based on the Item class, or one of it's abstract subclasses.
 * @param {Object} config
 * @param {String} config.name
 * @param {String} [config.extends]
 */
const makeClass = (config) => {
    if(!config.name) {
        Utils.error(`Cannot load item config, required property "name" is missing.`);
    }

    // Use the base Item class to extend from by default.
    let SuperClass = Item;

    // Use a more specific type (i.e. Ammunition, Clothes) to extend from if specified.
    if(config.extends){
        const pathToCheck = `${__dirname}/items/${config.extends}.js`;
        if (fs.existsSync(pathToCheck)) {
            SuperClass = require(`./items/${config.extends}`);
        }
        else {
            Utils.error(`Failed to load item config from ItemValues.yml for "${config.name}".
          The class to extend from cannot be found for given "extends" property "${config.extends}".
          Full path being checked: "${pathToCheck}"`);
        }
    }

    class GenericItem extends SuperClass { }

    GenericItem.assignPickupType(config.name);
    
    return GenericItem;
};

const populateList = () => {
    Utils.message("Populating items list.");

    try {
        // Load all of the pure config items from the item configs list.
        const itemConfigs = yaml.safeLoad(fs.readFileSync(__dirname + "/items/ItemValues.yml", "utf8"));
    
        itemConfigs.forEach((config) => {
            ItemsList[config.name] = makeClass(config);
        });
    } catch (error) {
        Utils.error(error);
    }

    // Import all of the files for items that have their own file/custom class.
    require("require-dir")("items", {
        recurse: true,
        mapKey: (value, baseName) => {
            if (typeof value === "function") {
                if(ItemsList[baseName]){
                    Utils.error(`Cannot load item "${baseName}", as it already exists in the items list. Each item can have an entry in the ItemValues.yml item config list, or a class file, but not both.`);
                }
                // Don't add abstract classes.
                // Only bother with classes that are actually going to get instantiated.
                if(value.hasOwnProperty("abstract")) return;

                value.assignPickupType(baseName);
                value.prototype.typeName = baseName;

                ItemsList[baseName] = value;
            }
        }
    });

    // Check all of the items are valid. i.e. are a class/function.
    Object.entries(ItemsList).forEach(([name, itemType]) => {
        // Skip the list itself.
        if (name === "LIST") return;

        if (typeof itemType !== "function") {
            Utils.error("Invalid item type added to ItemsList:", name);
        }

        // Need to do the registering here, so both the items from the config list and the ones loaded from file are done.
        itemType.registerItemType();
    });
    
    Utils.message("Finished populating items list.");
};

const initialiseList = () => {
    // Items list is now complete. Finish any setup for the classes in it.

    Utils.message("Initialising items list.");

    try {
        // Get the pure config items values again to finish setting them up, now that the classes are created.
        const itemConfigs = yaml.safeLoad(fs.readFileSync(__dirname + "/items/ItemValues.yml", "utf8"));
    
        itemConfigs.forEach((config) => {
            ItemsList[config.name].loadConfig(config);
        });
    } catch (error) {
        Utils.error(error);
    }

    Utils.message("Finished initialising items list. ItemsList is ready to use.");
};

const createCatalogue = () => {
    // Write the registered item types to the client, so the client knows what item to add for each type number.
    let dataToWrite = {};
    
    for (let itemTypeKey in ItemsList) {
        // Don't check prototype properties.
        if (ItemsList.hasOwnProperty(itemTypeKey) === false) continue;

        const itemType = ItemsList[itemTypeKey];
        const itemPrototype = itemType.prototype;
        // Catches the LIST reference thing that is set up at the end of server init, which won't have a type number at all.
        if (itemPrototype === undefined) continue;
        // Only add registered types.
        if (itemPrototype.typeNumber === "Type not registered.") continue;
        // Add this item type to the type catalogue.
        dataToWrite[itemPrototype.typeNumber] = {
            typeNumber: itemPrototype.typeNumber,
            translationID: itemType.translationID,
            iconSource: itemType.iconSource,
            soundType: itemType.soundType,
        };
    }

    dataToWrite = JSON.stringify(dataToWrite);

    Utils.checkClientCataloguesExists();

    // Write the data to the file in the client files.
    fs.writeFileSync("../client/src/catalogues/ItemTypes.json", dataToWrite);

    Utils.message("Item types catalogue written to file.");
};

module.exports = {
    populateList,
    initialiseList,
    createCatalogue,
};
