import { Items } from '@dungeonz/configs';
import { ItemDataConfig } from '@dungeonz/types';
import { error, message } from '@dungeonz/utils';
import { ensureDirSync, writeFileSync } from 'fs-extra';
import path from 'path';
import requireDir from 'require-dir';
import Item from './classes/Item';
import ItemsList from './ItemsList';

/**
 * Creates a generic class for an item based on the Item class, or one of it's abstract subclasses.
 */
const makeClass = ({
    name,
    extendsClassName,
}: {
    name: string;
    extendsClassName?: string;
}) => {
    if (!name) {
        error('Cannot load item config, required property "name" is missing.');
    }

    // Use the base Item class to extend from by default.
    let SuperClass: typeof Item = Item;

    // Use a more specific type (i.e. Ammunition, Clothes) to extend from if specified.
    if (extendsClassName) {
        if (ItemsList.ABSTRACT_CLASSES[extendsClassName]) {
            SuperClass = ItemsList.ABSTRACT_CLASSES[extendsClassName];
        }
        else {
            error(`Failed to load item config from Items.yaml for "${name}".
          The class to extend from cannot be found for given "extends" property "${extendsClassName}".
          Check it is actually extending from an abstract item type.`);
        }
    }

    class GenericItem extends SuperClass { }

    GenericItem.assignPickupType(name);

    return GenericItem;
};

export const populateList = () => {
    message('Populating items list.');

    // Import all of the files for items that have their own class file for specific logic.
    // eslint-disable-next-line global-require
    requireDir('classes', {
        recurse: true,
        mapKey: (value: {default: typeof Item}, baseName: string) => {
            const ItemClass = value.default;
            if (typeof ItemClass === 'function') {
                if (ItemsList.BY_NAME[baseName]) {
                    error(`Cannot load item "${baseName}", as it already exists in the items list.`);
                }
                // Don't add abstract classes.
                // Only bother with classes that are actually going to get instantiated.
                if (ItemClass.hasOwnProperty.call(ItemClass, 'abstract')) {
                    if (ItemsList.ABSTRACT_CLASSES[baseName]) {
                        error(`Cannot load abstract item type "${baseName}", as it already exists in the abstract classes list.`);
                    }
                    // Still add it to the separate list of abstract classes though, as it may still be needed.
                    ItemsList.ABSTRACT_CLASSES[baseName] = ItemClass;
                    return;
                }

                ItemClass.assignPickupType(baseName);
                ItemClass.typeName = baseName;

                ItemsList.BY_NAME[baseName] = ItemClass;
            }
        },
    });

    try {
        // Load all of the item configs.
        Items.forEach((config: {name: string; extends: string}) => {
            // Only generate a class for this item if one doesn't already
            // exist, as it might have it's own special logic file.
            if (!ItemsList.BY_NAME[config.name]) {
                ItemsList.BY_NAME[config.name] = makeClass(config);
            }
        });
    }
    catch (err) {
        error(err);
    }

    // Check all of the items are valid. i.e. are a class/function.
    Object.entries(ItemsList.BY_NAME).forEach(([name, ItemType]) => {
        if (typeof ItemType !== 'function') {
            error('Invalid item type added to ItemsList:', name);
        }
    });

    message('Finished populating items list.');
};

export const initialiseList = () => {
    // Items list is now complete. Finish any setup for the classes in it.

    message('Initialising items list.');

    try {
        // Use the pure config items values again to finish setting them up, now that the classes are created.
        Items.forEach((config: any) => {
            if (!config.code) {
                error('Item config missing type code:', config);
            }

            if (ItemsList.BY_CODE[config.code]) {
                error(`Cannot initialise item for code "${config.code}", as it already exists in the items list. Item codes must be unique.`);
            }

            ItemsList.BY_NAME[config.name].loadConfig(config);
            // Add a reference to the item by its type code.
            ItemsList.BY_CODE[config.code] = ItemsList.BY_NAME[config.name];

            const ItemTypeProto = ItemsList.BY_NAME[config.name].prototype;

            // Mark any items that do something when used.
            if (ItemTypeProto.use !== Item.prototype.use
                || ItemTypeProto.onUsed !== Item.prototype.onUsed) {
                ItemsList.BY_NAME[config.name].hasUseEffect = true;
            }
        });
    }
    catch (err) {
        error(err);
    }

    // Check for any item classes that don't have an entry in the Items list.
    // All item types MUST have a type code at a minimum, so check for that.
    Object.entries(ItemsList.BY_NAME).forEach(([name, ItemType]) => {
        if (!ItemType.typeCode) {
            error('Invalid item type, missing typeCode. Item does not have a config in the Items list:', name);
        }
    });

    message('Finished initialising items list. ItemsList is ready to use.');
};

export const createCatalogue = () => {
    // Write the registered item types to the client, so the client knows what item to add for each type number.
    const dataToWrite: {[key: string]: ItemDataConfig} = {};

    Object.values(ItemsList.BY_NAME).forEach((ItemType) => {
        const itemTypePrototype = ItemType.prototype;

        // Add this item type to the type catalogue.
        dataToWrite[ItemType.typeCode] = {
            typeName: ItemType.typeName,
            typeCode: ItemType.typeCode,
            hasUseEffect: ItemType.hasUseEffect,
            equippable: itemTypePrototype.equip !== Item.prototype.equip,
            categories: ItemType.categories,
            translationId: '',
            iconSource: '',
        };
    });

    try {
        // Get the pure config items values again to finish setting them up, as not everything that
        // the client needs was added to the class.
        Items.forEach((config: any) => {
            const itemData: ItemDataConfig = dataToWrite[config.code];

            if (!config.translationId) {
                error('Item config missing translation id:', config);
            }
            if (!config.textureSource) {
                error('Item config missing texture source:', config);
            }

            itemData.translationId = config.translationId;
            itemData.iconSource = `icon-${config.textureSource}`;
            itemData.pickupSource = config.textureSource;
            itemData.pickupScaleModifier = config.pickupSpriteScaleModifier;
            itemData.soundType = config.soundType;
        });
    }
    catch (err) {
        error(err);
    }

    const outputPath = path.join(__dirname, '../api/resources/catalogues');

    ensureDirSync(outputPath);

    // Write the data to the file in the client files.
    writeFileSync(`${outputPath}/ItemTypes.json`, JSON.stringify(dataToWrite));

    message('Item types catalogue written to file.');
};
