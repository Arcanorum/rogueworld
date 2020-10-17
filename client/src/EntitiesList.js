// TODO: make some kind of "basic pickups" list type of thing to avoid needing a file each? they are all the same atm...

/**
 * A list of all client display entities that can be created.
 * @type {Object}
 */
export default (ctx => {
    let keys = ctx.keys();
    let values = keys.map(ctx);
    return keys.reduce((object, key, index) => {
        key = key.split("/").pop().slice(0, -3);
        object[key] = values[index].default;
        return object;
    }, {});
})(require.context('./entities/', true, /.js$/));