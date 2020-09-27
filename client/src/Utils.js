const Utils = {
    /**
     * Prints a system message in the project format.
     * Wrapper for console.log.
     * @param {*} message
     */
    message(...args) {
        args.unshift("*");
        console.log.apply(console, args);
    },

    /**
     * Prints a warning message.
     * @param {*} message
     */
    warning(...args) {
        args.unshift("* WARNING:");
        console.log.apply(console, args);
    },

    /**
     * Move the given 2D matrix up.
     * Modifies in place.
     * @param {Array.<Array>} matrix 
     */
    shiftMatrixUp(matrix) {
        Utils.shiftArrayLeft(matrix);
    },

    /**
     * Move the given 2D matrix down.
     * Modifies in place.
     * @param {Array.<Array>} matrix 
     */
    shiftMatrixDown(matrix) {
        Utils.shiftArrayRight(matrix);
    },

    /**
     * Move the given 2D matrix left.
     * Modifies in place.
     * @param {Array.<Array>} matrix 
     */
    shiftMatrixLeft(matrix) {
        matrix.forEach(array => {
            Utils.shiftArrayLeft(array);
        });
    },

    /**
     * Move the given 2D matrix right.
     * Modifies in place.
     * @param {Array.<Array>} matrix 
     */
    shiftMatrixRight(matrix) {
        matrix.forEach(array => {
            Utils.shiftArrayRight(array);
        });
    },

    /**
     * Move the given array along to the left/backwards.
     * Modifies in place.
     * ["A", "B", "C"] => ["B", "C", "A"]
     * @param {Array} array 
     */
    shiftArrayLeft(array) {
        array.push(array.shift());
    },

    /**
     * Move the given array along to the right/forwards.
     * Modifies in place.
     * ["A", "B", "C"] => ["C", "A", "B"]
     * @param {Array} array 
     */
    shiftArrayRight(array) {
        array.unshift(array.pop());
    }
};

export default Utils;