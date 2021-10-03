const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const Utils = require("../Utils");
const ItemsList = require("./ItemsList");
const Item = require("./classes/Item");

/**
 * Creates a generic class for an item based on the Item class, or one of it's abstract subclasses.
 * @param {Object} config
 * @param {String} config.name
 * @param {String} [config.extends]
 */
const makeClass = (config) => {
    if (!config.name) {
        Utils.error("Cannot load item config, required property \"name\" is missing.");
    }

    // Use the base Item class to extend from by default.
    let SuperClass = Item;

    // Use a more specific type (i.e. Ammunition, Clothes) to extend from if specified.
    if (config.extends) {
        // const pathToCheck = `${__dirname}/classes/${config.extends}.js`;
        if (ItemsList.AbstractClasses[config.extends]) {
            // eslint-disable-next-line global-require, import/no-dynamic-require
            SuperClass = ItemsList.AbstractClasses[config.extends];
        }
        else {
            Utils.error(`Failed to load item config from Items.yml for "${config.name}".
          The class to extend from cannot be found for given "extends" property "${config.extends}".
          Check it is actually extending from an abstract item type.`);
        }
    }

    class GenericItem extends SuperClass { }

    GenericItem.assignPickupType(config.name);

    return GenericItem;
};

const populateList = () => {
    Utils.message("Populating items list.");

    // Import all of the files for items that have their own class file for specific logic.
    // eslint-disable-next-line global-require
    require("require-dir")("classes", {
        recurse: true,
        mapKey: (value, baseName) => {
            if (typeof value === "function") {
                if (ItemsList.BY_NAME[baseName]) {
                    Utils.error(`Cannot load item "${baseName}", as it already exists in the items list.`);
                }
                // Don't add abstract classes.
                // Only bother with classes that are actually going to get instantiated.
                if (Object.prototype.hasOwnProperty.call(value, "abstract")) {
                    if (ItemsList.AbstractClasses[baseName]) {
                        Utils.error(`Cannot load abstract item type "${baseName}", as it already exists in the abstract classes list.`);
                    }
                    // Still add it to the separate list of abstract classes though, as it may still be needed.
                    ItemsList.AbstractClasses[baseName] = value;
                    return;
                }

                value.assignPickupType(baseName);
                value.prototype.typeName = baseName;

                ItemsList.BY_NAME[baseName] = value;
            }
        },
    });

    try {
        // Load all of the item configs.
        const itemConfigs = yaml.safeLoad(
            fs.readFileSync(
                path.resolve("./src/configs/Items.yml"), "utf8",
            ),
        );

        itemConfigs.forEach((config) => {
            // Only generate a class for this item if one doesn't already
            // exist, as it might have it's own special logic file.
            if (!ItemsList.BY_NAME[config.name]) {
                ItemsList.BY_NAME[config.name] = makeClass(config);
            }
        });
    }
    catch (error) {
        Utils.error(error);
    }

    // Check all of the items are valid. i.e. are a class/function.
    Object.entries(ItemsList.BY_NAME).forEach(([name, ItemType]) => {
        if (typeof ItemType !== "function") {
            Utils.error("Invalid item type added to ItemsList:", name);
        }
    });

    Utils.message("Finished populating items list.");
};

const initialiseList = () => {
    // Items list is now complete. Finish any setup for the classes in it.

    Utils.message("Initialising items list.");

    try {
        // Get the pure config items values again to finish setting them up, now that the classes are created.
        const itemConfigs = yaml.safeLoad(
            fs.readFileSync(
                path.resolve("./src/configs/Items.yml"), "utf8",
            ),
        );

        itemConfigs.forEach((config) => {
            if (!config.code) {
                Utils.error("Item config missing type code:", config);
            }

            if (ItemsList.BY_CODE[config.code]) {
                Utils.error(`Cannot initialise item for code "${config.code}", as it already exists in the items list. Item codes must be unique.`);
            }

            ItemsList.BY_NAME[config.name].loadConfig(config);
            // Add a reference to the item by its type code.
            ItemsList.BY_CODE[config.code] = ItemsList.BY_NAME[config.name];

            const ItemTypeProto = ItemsList.BY_NAME[config.name].prototype;

            // Mark any items that do something when used.
            if (ItemTypeProto.expGivenOnUse
                || ItemTypeProto.use !== Item.prototype.use
                || ItemTypeProto.onUsed !== Item.prototype.onUsed) {
                ItemTypeProto.hasUseEffect = true;
            }
        });
    }
    catch (error) {
        Utils.error(error);
    }

    // Check for any item classes that don't have an entry in the Items list.
    // All item types MUST have a type code at a minimum, so check for that.
    Object.entries(ItemsList.BY_NAME).forEach(([name, ItemType]) => {
        if (!ItemType.prototype.typeCode) {
            Utils.error("Invalid item type, missing typeCode. Item does not have a config in the Items list:", name);
        }
    });

    Utils.message("Finished initialising items list. ItemsList is ready to use.");
};

const createCatalogue = () => {
    // Write the registered item types to the client, so the client knows what item to add for each type number.
    let dataToWrite = {};

    Object.values(ItemsList.BY_NAME).forEach((ItemType) => {
        const itemTypePrototype = ItemType.prototype;

        // Add this item type to the type catalogue.
        dataToWrite[itemTypePrototype.typeCode] = {
            typeName: itemTypePrototype.typeName,
            typeCode: itemTypePrototype.typeCode,
            hasUseEffect: itemTypePrototype.hasUseEffect,
            equippable: itemTypePrototype.equip !== Item.prototype.equip,
            category: itemTypePrototype.category || undefined, // Don't include it if it is null. undefined will get stripped out.
            useEnergyCost: itemTypePrototype.useEnergyCost,
        };
    });

    try {
        // Get the pure config items values again to finish setting them up, as not everything that
        // the client needs was added to the class.
        const itemConfigs = yaml.safeLoad(
            fs.readFileSync(
                path.resolve("./src/configs/Items.yml"), "utf8",
            ),
        );

        itemConfigs.forEach((config) => {
            const itemData = dataToWrite[config.code];

            if (!config.translationID) {
                Utils.error("Item config missing translation id:", config);
            }
            if (!config.textureSource) {
                Utils.error("Item config missing texture source:", config);
            }

            itemData.translationID = config.translationID;
            itemData.iconSource = `icon-${config.textureSource}`;
            itemData.pickupSource = config.textureSource;
            itemData.pickupScaleModifier = config.pickupSpriteScaleModifier;
            itemData.soundType = config.soundType;
        });
    }
    catch (error) {
        Utils.error(error);
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
