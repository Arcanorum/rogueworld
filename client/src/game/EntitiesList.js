import Utils from "../shared/Utils";
import GenericPickupsList from "./entities/pickups/GenericPickupsList";

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
 * @type {Object}
 */
export default ((context) => {
    const paths = context.keys();
    const values = paths.map(context);
    // Add each class to the list by file name.
    const entitiesList = paths.reduce((list, path, index) => {
        // Trim the ".js" from the end of the file name.
        const fileName = path.split("/").pop().slice(0, -3);
        // Need to use .default to get the class from the file, or would need to actually import it.
        list[fileName] = values[index].default;
        return list;
    }, {});

    // Add the generic pickups that don't have their own class files.
    // They get classes made for them on startup.
    Object.entries(GenericPickupsList).forEach(([key, value]) => {
        key = `Pickup${key}`;
        // Check for duplicate entries in the list.
        if (entitiesList[key]) {
            Utils.warning(
                `Building entities list. Adding generated pickup class for "${key}", but type already exists with this key. Skipping. `
                + "A pickup type should be defined either in a class file (if it does something special), or in the pickups list, but not both.",
            );
            return;
        }

        entitiesList[key] = value;
    });

    return entitiesList;
})(require.context("./entities/", true, /.js$/));
