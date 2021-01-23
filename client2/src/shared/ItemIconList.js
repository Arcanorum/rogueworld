/**
 * Returns a list of all of the item icon source URIs as output by webpack, so
 * they can be used as necessary by other modules without them having to load
 * them all themselves each time.
 * Useful for anything that needs to be able to load any item icon at any time,
 * such as the inventory.
 */
export default (() => {
    const context = require.context("../assets/images/gui/items/", true, /.png$/);
    const paths = context.keys();
    const values = paths.map(context);

    // Add each path to the list by their item name.
    const itemIconsList = paths.reduce((list, path, index) => {
        // Trim the "icon-" from the start and ".png" from the end of the path.
        const itemName = path.split("/").pop().slice(0, -4);
        // Need to use .default to get the value of the path, or would need to actually import it.
        list[itemName] = values[index].default;
        return list;
    }, {});

    return itemIconsList;
})();
