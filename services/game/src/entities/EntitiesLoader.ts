import { EntityDataConfig } from '@dungeonz/types';
import { error, message } from '@dungeonz/utils';
import { ensureDirSync, writeFileSync } from 'fs-extra';
import requireDir from 'require-dir';
import { EntitiesList } from '.';
import Entity from './classes/Entity';

export const populateList = () => {
    message('Populating entities list.');

    // Import all of the files for entities that have their own class file for specific logic.
    // eslint-disable-next-line global-require
    requireDir('classes', {
        recurse: true,
        mapKey: (value: {default: typeof Entity}, baseName: string) => {
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

                EntitiesList.BY_NAME[baseName] = EntityClass;
            }
        },
    });

    // EntitiesList.ABSTRACT_CLASSES.ResourceNode.createClasses();

    message('Finished populating entities list.');
};

export const initialiseList = () => {
    message('Initialising entities list.');

    // EntitiesList.ABSTRACT_CLASSES.Mob.loadConfigs();

    // EntitiesList.ABSTRACT_CLASSES.ResourceNode.loadConfigs();

    message('Finished initialising entities list. EntitiesList is ready to use.');
};

export const createCatalogue = () => {
    // Write the registered entity types to the client, so the client knows what entity to add for each type number.
    const dataToWrite: {[key: number]: EntityDataConfig} = {};

    Object.entries(EntitiesList.BY_NAME).forEach(([entityTypeKey, EntityType]) => {
        // Only add registered types.
        if (!EntityType.typeNumber) {
            error('Entity type is missing a type number:', EntityType);
        }

        // Add this entity type to the type catalogue.
        dataToWrite[EntityType.typeNumber] = {
            typeName: entityTypeKey,
        };
    });

    const outputPath = './src/api/resources/catalogues';

    ensureDirSync(outputPath);

    // Write the data to the file in the client files.
    writeFileSync(`${outputPath}/EntityTypes.json`, JSON.stringify(dataToWrite));

    message('Entity types catalogue written to file.');
};
