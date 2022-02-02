import { warning } from '../../../../shared/utils';
import Entity from './entities/Entity';
// import GenericPickupsList from './entities/pickups/GenericPickupsList';
// import GenericProjectilesList from './entities/projectiles/GenericProjectilesList';

/**
 * A list of all client display entities that can be instantiated.
 * Created using all of the JS files found in /entities, to avoid having a huge list of imports.
 * The list looks like `<FILENAME>: <TYPE/CLASS>`.
 * @example
 * {
 *     Knight: Entity,
 *     ProjShuriken: Entity,
 *     PickupFireGem: Pickup, // Specialised pickup class
 *     PickupIronBar: GenericPickup, // Generated pickup class
 * }
 */
export default (() => {
    const context = require.context('./entities/', true, /.js$/);
    const paths = context.keys();
    const values = paths.map(context) as Array<{[key: string]: typeof Entity}>;

    // Add each class to the list by file name.
    const entitiesList = paths
        .reduce((list: {[key: string]: typeof Entity}, path, index) => {
            const popped = path.split('/').pop();
            if(!popped) return list;

            let fileName = popped;
            // Skip the generic lists.
            if (fileName.startsWith('Generic')) return list;
            // Trim the ".js" from the end of the file name.
            fileName = fileName.slice(0, -3);
            // Need to use .default to get the class from the file, or would need to actually import it.
            list[fileName] = values[index].default;
            return list;
        }, {});

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

    return entitiesList;
})();
