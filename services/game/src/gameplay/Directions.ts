import { Directions, Offset, RowCol } from '@dungeonz/types';

/**
 * Converts a row and column offset into a direction.
 */
export const rowColOffsetToDirection = (rowOffset: Offset, colOffset: Offset) => {
    if (rowOffset < 0) return Directions.UP;

    if (rowOffset > 0) return Directions.DOWN;

    if (colOffset < 0) return Directions.LEFT;

    if (colOffset > 0) return Directions.RIGHT;

    return Directions.UP;
};

type SideRowCols = [RowCol, RowCol];

/**
 * Gets a pair of row/col offsets, one for each side relative to the given direction.
 * @returns The offsets of the sides.
 */
export const getRowColsToSides = (direction: Directions, row: number, col: number): SideRowCols => {
    if (direction === Directions.UP || direction === Directions.DOWN) {
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
