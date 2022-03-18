import { error, warning } from '@dungeonz/utils';
import Config from '../shared/Config';
import Entity from './entities/Entity';
// import GenericPickupsList from './entities/pickups/GenericPickupsList';
// import GenericProjectilesList from './entities/projectiles/GenericProjectilesList';

/**
 * Creates a generic class for an entity based on the Entity class, or one of it's abstract subclasses.
 */
const makeClass = ({
    typeName,
    extendsClassName,
}: {
    typeName: string;
    extendsClassName?: string;
}) => {
    if (!typeName) {
        error('Cannot load entity config, required property "typeName" is missing.');
    }

    // Use the base entity class to extend from by default.
    let SuperClass: typeof Entity = Entity;

    // Use a more specific type (i.e. Boss, Structure) to extend from if specified.
    if (extendsClassName) {
        if (Config.EntitiesList[extendsClassName]) {
            SuperClass = Config.EntitiesList[extendsClassName];
        }
        else {
            error(`Failed to make entity class for "${typeName}".
          The class to extend from cannot be found for given "extends" property "${extendsClassName}".
          Check it is actually extending from an existing entity type, i.e. Mob, Pickup.`);
        }
    }

    class GenericEntity extends SuperClass { }

    return GenericEntity;
};

/**
 * A list of all client display entities that can be instantiated.
 * Created using all of the TS files found in /entities, to avoid having a huge list of imports.
 * The list looks like `<FILENAME>: <TYPE/CLASS>`.
 * @example
 * {
 *     Knight: Entity,
 *     ProjShuriken: Entity,
 *     PickupFireGem: Pickup, // Specialised pickup class
 *     PickupIronBar: GenericPickup, // Generated pickup class
 * }
 */
const generateEntitiesList = () => {
    const context = require.context('./entities/', true, /.ts$/);
    const paths = context.keys();
    const values = paths.map(context) as Array<{[key: string]: typeof Entity}>;

    // Add each class to the list by file name.
    paths.forEach((path, index) => {
        const popped = path.split('/').pop();
        if(!popped) return;

        let fileName = popped;
        // Skip the generic lists.
        if (fileName.startsWith('Generic')) return;
        // Trim the ".ts" from the end of the file name.
        fileName = fileName.slice(0, -3);
        // Check it isn't already loaded.
        if(Config.EntitiesList[fileName]) {
            warning('Loading entities list. Entity type already exists in entities list:', fileName);
            return;
        }
        // Need to use .default to get the class from the file, or would need to actually import it.
        Config.EntitiesList[fileName] = values[index].default;
    });

    Object.entries(Config.EntityTypes).forEach(([typeNumber, config]) => {
        const { typeName } = config;
        if(!Config.EntitiesList[typeName]) {
            // Make a new generic sprite class.
            Config.EntitiesList[typeName] = makeClass(config);
        }
    });

    // Classes from file and generated ones are now ready. Set them up with the config values.
    Object.entries(Config.EntityTypes).forEach(([typeNumber, config]) => {
        const { typeName } = config;
        const SpriteClass = Config.EntitiesList[typeName];

        if(SpriteClass.loadConfig) {
            SpriteClass.loadConfig(config);
        }
    });

    // Add the generic entities that don't have their own class files.
    // They get classes made for them on startup.
    // Object.entries(Entities).forEach(([ key, value ]) => {
    //     key = `Pickup${key}`;
    //     // Check for duplicate entries in the list.
    //     if (entitiesList[key]) {
    //         warning(
    //             `Building entities list. Adding generated pickup class for "${key}", but type already exists with this key. Skipping. `
    //             + 'A pickup type should be defined either in a class file (if it does something special), or as an entry in the items list, but not both.',
    //         );
    //         return;
    //     }

    //     entitiesList[key] = value;
    // });

    // Add the generic pickups that don't have their own class files.
    // They get classes made for them on startup.
    // Object.entries(GenericPickupsList).forEach(([ key, value ]) => {
    //     key = `Pickup${key}`;
    //     // Check for duplicate entries in the list.
    //     if (entitiesList[key]) {
    //         warning(
    //             `Building entities list. Adding generated pickup class for "${key}", but type already exists with this key. Skipping. `
    //             + 'A pickup type should be defined either in a class file (if it does something special), or as an entry in the items list, but not both.',
    //         );
    //         return;
    //     }

    //     entitiesList[key] = value;
    // });

    // Add the generic projectiles that don't have their own class files.
    // They get classes made for them on startup.
    // Object.entries(GenericProjectilesList).forEach(([ key, value ]) => {
    //     // Check for duplicate entries in the list.
    //     if (entitiesList[key]) {
    //         warning(
    //             `Building entities list. Adding generated projectile class for "${key}", but type already exists with this key. Skipping. `
    //             + 'A projectile type should be defined either in a class file (if it does something special), or in the projectiles list, but not both.',
    //         );
    //         return;
    //     }

    //     entitiesList[key] = value;
    // });
};

export default generateEntitiesList;
