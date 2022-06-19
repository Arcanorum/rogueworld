import { Directions } from '@rogueworld/types';
import { rowColOffsetToDirection } from './Directions';

test('should return the correct directions', async() => {
    console.log('correct dirs');

    expect(rowColOffsetToDirection(-1, 0)).toBe(Directions.UP);

    expect(rowColOffsetToDirection(1, 0)).toBe(Directions.DOWN);

    expect(rowColOffsetToDirection(0, -1)).toBe(Directions.LEFT);

    expect(rowColOffsetToDirection(0, 1)).toBe(Directions.RIGHT);
});

test('should return the up as the default for invalid offsets', async() => {
    expect(rowColOffsetToDirection(0, 0)).toBe(Directions.UP);

    expect(rowColOffsetToDirection(5 as any, -5 as any)).toBe(Directions.UP);
});
