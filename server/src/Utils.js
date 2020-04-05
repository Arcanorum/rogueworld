
const fs = require('fs');

class Utils {
    /**
     * @class Creates a counter that will track it's own 
     * count and allow the next count to be retrieved.
     * Useful for creating unique IDs.
     */
    Counter = class Counter {
        constructor () {
            this._count = 0;
        }
    
        getNext () {
            this._count += 1;
            return this._count;
        }
    }

    /**
     * Gets a random number between, and including, min and max.
     * @param {Number} min
     * @param {Number} max
     * @returns {*}
     */
    getRandomIntInclusive (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Gets a random element from the given array.
     * @param {Array} array
     * @returns {*}
     */
    getRandomElement (array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * @param {Array} array
     * @param {String} nameKey - The name of each propety key on the result object.
     * @param {String} valueKey - The name of the property to use as each propety value.
     */
    arrayToObject (array, nameKey, valueKey) {
        if(Array.isArray(array) === false) return {};
        
        return array.reduce((obj, item) => {
            obj[item[nameKey]] = item[valueKey];
            return obj;
        }, {});
    }

    /**
     * Push an item into an array multiple times.
     * @param {Array} array - The array to push into.
     * @param {*} item - The item to add.
     * @param {Number} number - How many times the item should be added.
     */
    arrayMultiPush = (array, item, amount) => {
        for(let i=0; i<amount; i+=1){
            array.push(item);
        }
    }

    /**
     * Checks the location to write to exists. If not, creates it.
     * @param {String} directory The directory to check for.
     */
    checkDirectoryExists (directory) {
        if (fs.existsSync(directory) === false) {
            fs.mkdirSync(directory);
        }
    }

    /**
     * Checks the client catalogues directory exists. If not, creates it.
     */
    checkClientCataloguesExists () {
        this.checkDirectoryExists('../client/src/catalogues');
    }

    /**
     * Prints a warning message.
     * @param {*} message
     */
    warning (...args) {
        args.unshift("* WARNING:");
        console.log.apply(console, args);
    }

    /**
     * Stops the process and prints an error message.
     * @param {*} message
     */
    error (...args) {
        args.unshift("* ERROR: ");
        console.error.apply(console, args);
        console.trace();
        process.exit();
    }

};

module.exports = new Utils();