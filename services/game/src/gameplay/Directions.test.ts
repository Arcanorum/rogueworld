import { Directions } from '@rogueworld/types';
import { rowColOffsetToDirection, getRowColsToSides } from './Directions';

describe('directions', () => {
    test('should return the correct directions', async() => {
        console.log('correct dirs');

        expect(rowColOffsetToDirection(-1, 0)).toEqual(Directions.UP);

        expect(rowColOffsetToDirection(1, 0)).toEqual(Directions.DOWN);

        expect(rowColOffsetToDirection(0, -1)).toEqual(Directions.LEFT);

        expect(rowColOffsetToDirection(0, 1)).toEqual(Directions.RIGHT);
    });

    test('should return the up as the default for invalid offsets', async() => {
        expect(rowColOffsetToDirection(0, 0)).toEqual(Directions.UP);

        expect(rowColOffsetToDirection(5 as any, -5 as any)).toEqual(Directions.UP);
    });

    test('should return the correct side positions relative of each direction', async() => {
        const row = 15;
        const col = 20;

        const upDownSides = [
            { row, col: col - 1 },
            { row, col: col + 1 },
        ];

        const leftRightSides = [
            { row: row - 1, col },
            { row: row + 1, col },
        ];

        expect(getRowColsToSides(Directions.UP, row, col)).toEqual(upDownSides);

        expect(getRowColsToSides(Directions.DOWN, row, col)).toEqual(upDownSides);

        expect(getRowColsToSides(Directions.LEFT, row, col)).toEqual(leftRightSides);

        expect(getRowColsToSides(Directions.RIGHT, row, col)).toEqual(leftRightSides);
    });
});
