import { CraftingStationClasses, Entities } from '@dungeonz/configs';
import { EntityClientConfig } from '@dungeonz/types';
import { error, message } from '@dungeonz/utils';
import path from 'path';
import { ensureDirSync, writeFileSync } from 'fs-extra';
import requireDir from 'require-dir';
import { EntitiesList } from '.';
import Dynamic from './classes/Dynamic';
import Entity from './classes/Entity';
import Drop, { DropConfig } from '../gameplay/Drop';

/**
 * Creates a generic class for an entity based on the Dynamic class, or one of it's abstract subclasses.
 */
const makeClass = ({
    name,
    extendsClassName,
}: {
    name: string;
    extendsClassName?: string;
}) => {
    if (!name) {
        error('Cannot load entity config, required property "name" is missing.');
    }

    // Use the base dynamic class to extend from by default.
    let SuperClass: typeof Entity = Dynamic;

    // Use a more specific type (i.e. Boss, Structure) to extend from if specified.
    if (extendsClassName) {
        if (EntitiesList.ABSTRACT_CLASSES[extendsClassName]) {
            SuperClass = EntitiesList.ABSTRACT_CLASSES[extendsClassName];
        }
        else {
            error(`Failed to load entity config from Entities.yaml for "${name}".
          The class to extend from cannot be found for given "extends" property "${extendsClassName}".
          Check it is actually extending from an abstract entity type.`);
        }
    }

    class GenericEntity extends SuperClass { }

    GenericEntity.registerEntityType();
    GenericEntity.typeName = name;

    return GenericEntity;
};

export const populateList = () => {
    message('Populating entities list.');

    // Import all of the files for entities that have their own class file for specific logic.
    // eslint-disable-next-line global-require
    requireDir('classes', {
        recurse: true,
        mapKey: (value: {default: typeof Dynamic}, baseName: string) => {
            const EntityClass = value.default;
            if (typeof EntityClass === 'function') {
                if (EntitiesList.BY_NAME[baseName]) {
                    error(`Cannot load entity "${baseName}", as it already exists in the entities list.`);
                }

                if (baseName !== EntityClass.prototype.constructor.name) {
                    error(`Cannot load entity "${baseName}", as the name of the class exported from the file does not match the file name.`);
                }

                // Don't do any additional setup for abstract classes.
                // Only bother with classes that are actually going to get instantiated.
                if (EntityClass.hasOwnProperty.call(EntityClass, 'abstract')) {
                    if (EntitiesList.ABSTRACT_CLASSES[baseName]) {
                        error(`Cannot load abstract entity type "${baseName}", as it already exists in the abstract classes list.`);
                    }
                    // Still add it to the separate list of abstract classes though, as it may still be needed.
                    EntitiesList.ABSTRACT_CLASSES[baseName] = EntityClass;
                    return;
                }

                EntityClass.registerEntityType();
                EntityClass.typeName = baseName;

                EntitiesList.BY_NAME[baseName] = EntityClass;
            }
        },
    });

    // Load all of the entity configs.
    Entities.forEach((config: any) => {
        // Only generate a class for this entity if one doesn't already
        // exist, as it might have it's own special logic file.
        if (!EntitiesList.BY_NAME[config.name]) {
            EntitiesList.BY_NAME[config.name] = makeClass(config);
        }
    });

    message('Finished populating entities list.');
};

export const initialiseList = () => {
    message('Initialising entities list.');

    Entities.forEach((config: any) => {
        const EntityClass = EntitiesList.BY_NAME[config.name] as typeof Dynamic;
        type PropName = keyof typeof Dynamic;

        Object.entries(config).forEach(([_key, value]) => {
            const key = _key as PropName;

            // Load whatever properties that have the same key in the config as on this class.
            if (key in EntityClass) {
                // Check if the property has already been loaded by a
                // subclass, or set on the class prototype for class files.
                if (
                    Object.getPrototypeOf(EntityClass)[key] === EntityClass[key]
                ) {
                    // Add any specific config property loaders here.
                    if(key === 'dropList') {
                        if (!Array.isArray(value)) error('Invalid drop list given. Must be an array:', config.dropList);

                        const dropList: Array<Drop> = [];

                        (value as Array<DropConfig>).forEach((dropConfig) => {
                            dropList.push(new Drop(dropConfig));
                        });

                        value = dropList;
                    }

                    // Check the given crafting station class is valid.
                    if(key === 'craftingStationClass') {
                        if(!CraftingStationClasses.includes(value as string)) {
                            error('Invalid crafting station class given. Must be in the crafting station classes list:', config.craftingStationClass);
                        }
                    }

                    // eslint-disable-next-line
                    // @ts-ignore
                    EntityClass[key] = value;
                }
            }
            else {
                error('Invalid entity config key:', key);
            }
        });
    });

    // EntitiesList.ABSTRACT_CLASSES.Mob.loadConfigs();

    // EntitiesList.ABSTRACT_CLASSES.ResourceNode.loadConfigs();

    message('Finished initialising entities list. EntitiesList is ready to use.');
};

export const createCatalogue = () => {
    // Write the registered entity types to the client, so the client knows what entity to add for each type number.
    const dataToWrite: {[key: number]: EntityClientConfig} = {};

    Object.entries(EntitiesList.BY_NAME).forEach(([entityTypeKey, EntityType]) => {
        // Only add registered types.
        if (!EntityType.typeNumber) {
            error('Entity type is missing a type number:', EntityType);
        }

        // Add this entity type to the type catalogue.
        dataToWrite[EntityType.typeNumber] = {
            typeName: EntityType.typeName,
            craftingStationClass: EntityType.craftingStationClass,
            ...EntityType.clientConfig,
        };
    });

    const outputPath = path.join(__dirname, '../api/resources/catalogues');

    ensureDirSync(outputPath);

    writeFileSync(`${outputPath}/EntityTypes.json`, JSON.stringify(dataToWrite));

    message('Entity types catalogue written to file.');
};
