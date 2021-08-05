const ItemsList = {
    /**
     * A list of all abstract item types. These won't be available in any other list.
     * @type {Object}
     */
    AbstractClasses: {},
    /**
     * The list of item types, by their unique code. i.e. "ABCD1234".
     * @type {Object}
     */
    BY_CODE: {},
    /**
     * The list of item types, by their unique class name. i.e. "IronSword".
     * @type {Object}
     */
    BY_NAME: {},
};

module.exports = ItemsList;
