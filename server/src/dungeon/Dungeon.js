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
    constructor(config) {

        this.id = idCounter.getNext();

        // The dungeon itself needs to know where the exit 
        // is that it should evict any players it has to.
        this.exitEntranceName = null;

        //console.log("new dungeon, config?:", config);

        // Create a board instance from the map data.
        this.board = new Board(config.mapData, config.name, config.alwaysNight, true);

        // Link the board exits/overworld portals in the dungeon to the ones outside of the dungeon map.
        this.linkExits();

        /**
         * Locked doors in dungeons stay open when unlocked, but are closed when the boss respawns.
         * @type {Array.<Interactable>}
         */
        //this.lockedDoors = [];

        /**
         * A list of the mobs that have keys in their drop lists, so they can be killed and respawned in their correct areas.
         * @type {Object}
         */
        //this.keyHolders = {};

        /**
         * Whether the completion criteria for this dungeon has been met.
         * @type {Boolean}
         */
        this.completed = false;

        /**
         * 
         * @type {Number}
         */
        this.timeRemaining = config.timeLimitMinutes * 1000 * 60;

        this.timeUpTimeout = setTimeout(() => {
            // Time is up, end the dungeon.
            console.log("dungeon instance time is up!");

            this.evictAllPlayers();

            this.timeUpTimeout = null;
        }, this.timeRemaining);

    }

    linkExits() {
        // For each row in the board grid.
        this.board.grid.forEach((col) => {
            col.forEach((boardTile) => {
                // Check if the static is an exit.
                const exit = boardTile.static;
                if (exit instanceof Exit) {
                    // If the target for this exit isn't valid (might have been removed from the map), then destroy this exit.
                    if (BoardsList.boardsObject[exit.targetBoard] === undefined) {
                        exit.destroy();
                        return;
                    }
                    if (BoardsList.boardsObject[exit.targetBoard].entrances[exit.targetEntrance] === undefined) {
                        exit.destroy();
                        return;
                    }
                    // Currently, the exits have the string name of the board and entrance they should
                    // use in place of the actual objects, which are now used to set the actual objects.
                    exit.targetBoard = BoardsList.boardsObject[exit.targetBoard];
                    exit.targetEntrance = exit.targetBoard.entrances[exit.targetEntrance];
                }
            });
        });
    }

    setCompleted() {
        this.completed = true;

        // Tell the players in this dungeon that it is completed.

    }

    evictAllPlayers() {
        console.log("evicting all players");
        // Send all players on the board to the entrance that this dungeon exits to.
        //this.board
    }

}

module.exports = Dungeon;

const Board = require('../board/Board');
const BoardsList = require('../board/BoardsList');
const Exit = require('../entities/statics/interactables/exits/Exit');