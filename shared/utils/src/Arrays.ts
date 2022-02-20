import { ObjectOfAny } from '@dungeonz/types';

/**
 * Gets a random element from the given array.
 */
export const getRandomElement = (array: Array<any>) => (
    array[Math.floor(Math.random() * array.length)]
);

/**
 * Randomly shuffles a given array around and returns the shuffled array.
 */
export const getShuffledArray = (array: Array<any>) => {
    const shuffled = array.slice(0);
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

/**
 * Creates an array of all permutations of a given array's elements.
 * @returns An array of arrays.
 */
export const getPermutations = (array: Array<any>) => {
    const result: Array<Array<any>> = [];

    const permute = (arr: Array<any>, m: Array<any> = []) => {
        if (arr.length === 0) {
            result.push(m);
        }
        else {
            for (let i = 0; i < arr.length; i += 1) {
                const curr = arr.slice();
                const next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next));
            }
        }
    };

    permute(array);

    return result;
};

/**
 * Takes an array of objects, and returns a new object where each key/value is pulled from each
 * element (object) in the array, by the given target property names.
 * Useful for formatting JSON data from Tiled.
 * @param nameKey - The name of each property key on the result object.
 * @param valueKey - The name of the property to use as each propety value.
 * @example
 * const objects = [{foo: "bar", baz: 123}, {foo: "qux"}, {baz: "corge"}];
 * arrayOfObjectsToObject(objects, "baz", "foo");
 * // {
 * //   "123": "bar",
 * //   "undefined": "qux",
 * //   "corge": undefined
 * // }
 */
export const arrayOfObjectsToObject = (
    array: Array<ObjectOfAny>,
    nameKey: string,
    valueKey: string,
): ObjectOfAny => {
    if (Array.isArray(array) === false) return {};

    return array.reduce((obj, item) => {
        obj[(item[nameKey])] = item[valueKey];
        return obj;
    }, {} as ObjectOfAny);
};

/**
 * Push an item into an array multiple times.
 * @param array - The array to push into.
 * @param item - The item to add.
 * @param number - How many times the item should be added.
 */
export const arrayMultiPush = (array: Array<any>, item: any, amount: number) => {
    for (let i = 0; i < amount; i += 1) {
        array.push(item);
    }
};

/**
 * Move the given array along to the left/backwards.
 * Modifies in place.
 * ["A", "B", "C"] => ["B", "C", "A"]
 */
export const shiftArrayLeft = (array: Array<any>) => {
    array.push(array.shift());
};

/**
 * Move the given array along to the right/forwards.
 * Modifies in place.
 * ["A", "B", "C"] => ["C", "A", "B"]
 */
export const shiftArrayRight = (array: Array<any>) => {
    array.unshift(array.pop());
};

/**
 * Move the given 2D matrix up.
 * Modifies in place.
 */
export const shiftMatrixUp = (matrix: Array<Array<any>>) => {
    shiftArrayLeft(matrix);
};

/**
 * Move the given 2D matrix down.
 * Modifies in place.
 */
export const shiftMatrixDown = (matrix: Array<Array<any>>) => {
    shiftArrayRight(matrix);
};

/**
 * Move the given 2D matrix left.
 * Modifies in place.
 */
export const shiftMatrixLeft = (matrix: Array<Array<any>>) => {
    matrix.forEach((array) => {
        shiftArrayLeft(array);
    });
};

/**
 * Move the given 2D matrix right.
 * Modifies in place.
 */
export const shiftMatrixRight = (matrix: Array<Array<any>>) => {
    matrix.forEach((array) => {
        shiftArrayRight(array);
    });
};

/**
 * Creates a new array compressed using run-length encoding.
 * @example
 * const myArr = ['a', 'a', 'a', 'a', 'b', 'b', 'c', 'c', 'c'];
 * runLengthEncodeArray(myArr); // [4,'a',2,'b',3,'c']
 */
export const runLengthEncodeArray = <T>(array: Array<T>) => {
    const result: Array<T | number> = [];
    if (array.length > 0) {
        let count = 1;
        let value = array[0];
        for (let i = 1; i < array.length; ++i) {
            const entry = array[i];
            if (entry == value) {
                count += 1;
            }
            else {
                result.push(count);
                result.push(value);
              	count = 1;
                value = entry;
            }
        }
        result.push(count);
        result.push(value);
    }
    return result;
};

/**
 * Inflates an array encoded using `runLengthEncodeArray` back to its original uncompressed form.
 * @example
 * const encodedArr = [4,'a',2,'b',3,'c'];
 * runLengthDecodeArray(encodedArr); // ['a', 'a', 'a', 'a', 'b', 'b', 'c', 'c', 'c']
 */
export const runLengthDecodeArray = <T>(array: Array<T | number>) => {
    const result: Array<T> = [];

    array.forEach((runLength, i) => {
        // Only use the even numbered elements, as they are the run length values.
        if(!(i % 2)) {
            arrayMultiPush(result, array[i + 1], runLength as number);
        }
    });

    return result;
};
