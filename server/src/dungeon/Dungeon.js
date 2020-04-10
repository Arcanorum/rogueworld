const Utils = require('../Utils');

const idCounter = new Utils.Counter();

class Dungeon {
    /**
     * @param {Object} config
     * @param {Object} config.name
     * @param {Object} config.mapData
     * @param {Object} config.alwaysNight
     * @param {Object} config.timeLimitMinutes
     */
    constructor (config) {
        
        this.id = idCounter.getNext();

        // The dungeon itself needs to know where the exit 
        // is that it should evict any players it has to.
        this.exitEntranceName = null;

        // Create a board instance from the map data.
        this.board = new Board(config.mapData, config.name, config.alwaysNight, true);

        /**
         * Locked doors in dungeons stay open when unlocked, but are closed when the boss respawns.
         * @type {Array.<Interactable>}
         */
        this.lockedDoors = [];

        /**
         * A list of the mobs that have keys in their drop lists, so they can be killed and respawned in their correct areas.
         * @type {Object}
         */
        this.keyHolders = {};

        /**
         * Whether the completion criteria for this dungeon has been met.
         * @type {Boolean}
         */
        this.completed = false;

        /**
         * 
         * @type {Number}
         */
        this.timeRemaining = 0;

        this.timeUpTimeout = setTimeout(() => {
            // Time is up, end the dungeon.
        }, timeout);

    }

    setCompleted () {
        this.completed = true;

        // Tell the players in this dungeon that it is completed.

    }

    evictAllPlayers () {
        // Send all players on the board to the entrance that this dungeon exits to.
        //this.board
    }

}

module.exports = Dungeon;

const Board = require('../board/Board');