const Utils = require("../Utils");

const UP = "u";
const DOWN = "d";
const LEFT = "l";
const RIGHT = "r";

/**
 * Valid directions for an entity to be facing. Only movables have a direction property, but other things might need to
 * know in what direction to place things.
 * @type {{UP: string, DOWN: string, LEFT: string, RIGHT: string}}
 */
module.exports.Directions = {
    UP,
    DOWN,
    LEFT,
    RIGHT,
};

/**
 * The valid directions stored as their raw values. Useful for iterating over.
 * @type {Array.<string>}
 */
module.exports.DirectionsValues = [
    UP,
    DOWN,
    LEFT,
    RIGHT,
];

/**
 * The inverse of the selected direction.
 * @type {{u: string, d: string, r: string, l: string}}
 */
module.exports.OppositeDirections = {
    u: DOWN,
    d: UP,
    l: RIGHT,
    r: LEFT,
};

/**
 * The directions that are on each side of each direction.
 * @type {u: [string, string], d: [string, string], l: [string, string], r: [string, string]}
 */
module.exports.SideDirections = {
    u: [LEFT, RIGHT],
    d: [RIGHT, LEFT],
    l: [DOWN, UP],
    r: [UP, DOWN],
};

/**
 * Each direction as a row and column offset.
 * @type {Object}
 */
module.exports.RowColOffsetsByDirection = {
    u: { row: -1, col: 0 },
    d: { row: 1, col: 0 },
    l: { row: 0, col: -1 },
    r: { row: 0, col: 1 },
};

/**
 * Converts a row and column offset into a direction.
 * @param {Number} rowOffset
 * @param {Number} colOffset
 * @returns {String} The direction of the offset. One of Directions.
 */
module.exports.rowColOffsetToDirection = (rowOffset, colOffset) => {
    if (rowOffset < 0) return UP;

    if (rowOffset > 0) return DOWN;

    if (colOffset < 0) return LEFT;

    if (colOffset > 0) return RIGHT;

    if (rowOffset === 0 && colOffset === 0) return UP;

    Utils.error(`A valid offset wasn't given to rowColOffsetToDirection, row: ${rowOffset}, col: ${colOffset}`);
    return undefined;
};

/**
 * Gets a pair of row/col offsets, one for each side relative to the given direction.
 * @param {string} direction
 * @param {number} row
 * @param {number} col
 * @returns {Array.<object>} The offsets of the sides. [{row: Number, col: Number}, {row: Number, col: Number}].
 */
module.exports.getRowColsToSides = (direction, row, col) => {
    if (direction === UP || direction === DOWN) {
        return [
            { row, col: col - 1 },
            { row, col: col + 1 },
        ];
    }
    // If it is not up or down, it must be left or right.
    return [
        { row: row - 1, col },
        { row: row + 1, col },
    ];
};

/**
 * A precomputed list of all of the different ways that the directions can be arranged.
 * Useful for picking a random set of directions to try to move an entity in, to make them less predictable.
 *  [
 *      ["u", "d", "l", "r"],
 *      ["u", "d", "r", "l"],
 *      ["u", "l", "d", "r"],
 *      ...
 *  ]
 * @type {Array.<Array.<String>>}
 */
module.exports.DirectionsPermutations = Utils.getPermutations(
    Object.values(module.exports.Directions),
);

/**
 * Similar to DirectionsPermutations, but with each direction for each permutation expressed
 * as a row & column board position offset object.
 *  [
 *      [ {row: -1, col: 0}, {row: 1, col: 0}, {row: 0, col: -1}, {row: 0, col: 1} ],
 *      [ {row: -1, col: 0}, {row: 1, col: 0}, {row: 0, col: 1}, {row: 0, col: -1} ],
 *      [ {row: -1, col: 0}, {row: 0, col: -1}, {row: 1, col: 0}, {row: 0, col: 1} ],
 *      ...
 *  ]
 * @type {Array.<Array.<Object>>}
 */
module.exports.DirectionsPermutationsAsRowColOffsets = (
    module.exports.DirectionsPermutations.map((directions) => (
        directions.map((direction) => (
            module.exports.RowColOffsetsByDirection[direction]
        ))
    ))
);
