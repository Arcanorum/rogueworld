import { getPermutations } from '@dungeonz/utils';
import { RowCol, RowColOffset } from '.';

/**
 * Valid directions for relative movement. Entities don't have a direction they are facing as such,
 * but may move up, left, etc. from where they currently are.
 */
export enum Directions {
    UP = 'u',
    DOWN = 'd',
    LEFT = 'l',
    RIGHT = 'r',
}

/**
 * The valid directions stored as their raw values. Useful for iterating over.
 */
export const DirectionsValues = [
    Directions.UP,
    Directions.DOWN,
    Directions.LEFT,
    Directions.RIGHT,
];

/**
 * The inverse of the selected direction.
 */
export enum OppositeDirections {
    u = Directions.DOWN,
    d = Directions.UP,
    l = Directions.RIGHT,
    r = Directions.LEFT,
}

/**
 * The directions that are on each side of each direction.
 */
export const SideDirections = {
    u: [Directions.LEFT, Directions.RIGHT],
    d: [Directions.RIGHT, Directions.LEFT],
    l: [Directions.DOWN, Directions.UP],
    r: [Directions.UP, Directions.DOWN],
};

/**
 * Each direction as a row and column offset.
 */
export const RowColOffsetsByDirection = {
    u: { row: -1, col: 0 } as RowColOffset,
    d: { row: 1, col: 0 } as RowColOffset,
    l: { row: 0, col: -1 } as RowColOffset,
    r: { row: 0, col: 1 } as RowColOffset,
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
 */
export const DirectionsPermutations: Array<Array<Directions>> = (
    getPermutations(Object.values(Directions))
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
 */
export const DirectionsPermutationsAsRowColOffsets: Array<Array<RowColOffset>> = (
    DirectionsPermutations.map((directions) => (
        directions.map((direction) => (
            RowColOffsetsByDirection[direction]
        ))
    ))
);
