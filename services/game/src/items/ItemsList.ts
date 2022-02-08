import Item from './classes/Item';

/**
 * A list of all abstract item types. These won't be available in any other list.
 */
const ABSTRACT_CLASSES: { [name: string]: typeof Item } = {};

/**
 * The list of item types, by their unique code. i.e. "ABCD1234".
 */
const BY_CODE: { [name: string]: typeof Item } = {};

/**
 * The list of item types, by their unique class name. i.e. "IronSword".
 */
const BY_NAME: { [name: string]: typeof Item } = {};

export default {
    ABSTRACT_CLASSES,
    BY_CODE,
    BY_NAME,
};
