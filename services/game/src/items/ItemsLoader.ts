import { Items, ItemWeightClasses } from '@rogueworld/configs';
import { ItemClientConfig } from '@rogueworld/types';
import { error, message } from '@rogueworld/utils';
import { ensureDirSync, writeFileSync } from 'fs-extra';
import path from 'path';
import requireDir from 'require-dir';
import { TaskTypes } from '../tasks';
import Item from './classes/Item';
import ItemsList from './ItemsList';
import StatusEffects from '../gameplay/status_effects';

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

    // Load all of the item configs.
    Items.forEach((config: {name: string; extends: string}) => {
        // Only generate a class for this item if one doesn't already
        // exist, as it might have it's own special logic file.
        if (!ItemsList.BY_NAME[config.name]) {
            ItemsList.BY_NAME[config.name] = makeClass({
                name: config.name,
                extendsClassName: config.extends,
            });
        }
    });

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

    // Use the pure config items values again to finish setting them up, now that the classes are created.
    Items.forEach((config: any) => {
        if (!config.code) {
            error('Item config missing type code:', config);
        }

        if (ItemsList.BY_CODE[config.code]) {
            error(`Cannot initialise item for code "${config.code}", as it already exists in the items list. Item codes must be unique.`);
        }

        const ItemClass = ItemsList.BY_NAME[config.name];
        type PropName = keyof typeof Item;

        Object.entries(config).forEach(([_key, value]) => {
            // Need to do these first as these properties have slightly different names in the
            // items config file vs the actual property name on the Item class.
            if (_key === 'name') {
                ItemClass.typeName = value as string;
                return;
            }

            if (_key === 'code') {
                ItemClass.typeCode = value as string;
                return;
            }

            // Already used to create the item class.
            if(_key === 'extends') {
                return;
            }

            // Needs to be converted from just the ids into actual task type references.
            if (_key === 'craftTasks') {
                if (!Array.isArray(value)) {
                    error('Item config property `craftTasks` must be an array:', config);
                }

                // Set own property for this item type, to prevent pushing into the parent (Item class) one.
                ItemClass.craftTaskIds = [];

                (value as Array<string>).forEach((taskName) => {
                    const taskId = `Craft${taskName}`;
                    // Check the task type is valid.
                    if (!TaskTypes[taskId]) {
                        error('Invalid task name in `craftTasks` list. Check it is in the task types list:', taskName);
                    }

                    ItemClass.craftTaskIds.push(taskId);
                });

                return;
            }

            // Used later to create the data for how to configure the items on the client.
            if(_key === 'clientConfig') {
                return;
            }

            const key = _key as PropName;

            // Load whatever properties that have the same key in the config as on this class.
            if (key in ItemClass) {
                // Check if the property has already been loaded by a
                // subclass, or set on the class prototype for class files.
                if (
                    Object.getPrototypeOf(ItemClass)[key] === ItemClass[key]
                ) {
                    // Add any specific config property loaders here.

                    // Check for any configs that are referencing a weight class by name.
                    if (key === 'unitWeight' && typeof value === 'string') {
                        // Use the weight value for the corresponding weight class.
                        // Check for undefined instead of using !, as the weight might be 0.
                        if (ItemWeightClasses[value] === undefined) {
                            error('Item weight class name does not exist in the item weight classes list: ', value);
                        }

                        if (typeof ItemWeightClasses[value] !== 'number') {
                            error('The entry in the item weight class list is not a number. All weight classes must be numbers: ', value);
                        }

                        value = ItemWeightClasses[value];
                    }

                    // Check for any configs that are referencing status effects by name.
                    if(key === 'statusEffectsOnUse' && Array.isArray(value)) {
                        value = value.map((statusEffectClassName: keyof typeof StatusEffects) => {
                            return StatusEffects[statusEffectClassName];
                        });
                    }

                    // eslint-disable-next-line
                    // @ts-ignore
                    ItemClass[key] = value;
                }
            }
            else {
                error(`Invalid item config key "${key}" found on config:`, config);
            }

            // Mark any items that do something when used.
            if (
                ItemClass.healingOnUseAmount !== Item.healingOnUseAmount ||
                ItemClass.damageOnUseAmount !== Item.damageOnUseAmount ||
                ItemClass.foodOnUseAmount !== Item.foodOnUseAmount ||
                ItemClass.statusEffectsOnUse !== Item.statusEffectsOnUse ||
                ItemClass.prototype.use !== Item.prototype.use ||
                ItemClass.prototype.onUsed !== Item.prototype.onUsed
            ) {
                ItemClass.hasUseEffect = true;
            }
        });

        // Add a reference to the item by its type code.
        ItemsList.BY_CODE[config.code] = ItemsList.BY_NAME[config.name];
    });

    // Check for any item classes that don't have an entry in the item configs file.
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
    const dataToWrite: {[key: string]: ItemClientConfig} = {};

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
            const itemData: ItemClientConfig = dataToWrite[config.code];

            if (!config.clientConfig.translationId) {
                error('Item config missing translation id:', config);
            }
            if (!config.clientConfig.textureSource) {
                error('Item config missing texture source:', config);
            }

            itemData.translationId = config.clientConfig.translationId;
            itemData.iconSource = `icon-${config.clientConfig.textureSource}`;
            itemData.pickupSource = config.clientConfig.textureSource;
            itemData.pickupScaleModifier = config.clientConfig.pickupSpriteScaleModifier;
            itemData.soundType = config.clientConfig.soundType;
        });
    }
    catch (err) {
        error(err);
    }

    const outputPath = path.join(__dirname, '../api/resources/catalogues');

    ensureDirSync(outputPath);

    writeFileSync(`${outputPath}/ItemTypes.json`, JSON.stringify(dataToWrite));

    message('Item types catalogue written to file.');
};
