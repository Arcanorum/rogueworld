const Utils = require("../Utils");
const Board = require("../board/Board");
const BoardsList = require("../board/BoardsList");
const Exit = require("../entities/classes/statics/interactables/exits/Exit");
const EventsList = require("../EventsList");

const idCounter = new Utils.Counter();

class Dungeon {
    /**
     * @param {Object} config
     * @param {Party} config.party
     * @param {String} config.name
     * @param {Object} config.mapData
     * @param {Boolean} config.alwaysNight
     * @param {Number} config.timeLimitMinutes
     * @param {String} config.evictionBoard
     * @param {String} config.evictionEntrance
     */
    constructor(config) {
        this.id = idCounter.getNext();

        // The board that players will be evicted to.
        this.evictionBoard = config.evictionBoard;

        // The entrance on the eviction board that players will be evicted to.
        this.evictionEntrance = config.evictionEntrance;

        this.dungeonManager = config.dungeonManager;

        // The party that has been transfered to this dungeon from the dungeon manager.
        // It is now up to the dungeon itself to manage the party.
        this.party = config.party;

        this.doorKeys = {
            red: 0,
            green: 0,
            blue: 0,
            yellow: 0,
            brown: 0,
        };

        // Create a board instance from the map data.
        this.board = new Board(config.mapData, config.name, config.alwaysNight, this);

        // Link the board exits/overworld portals in the dungeon to the ones outside of the dungeon map.
        this.linkExits();

        this.addPlayers(config.party.members, config.timeLimitMinutes);

        /**
         * Whether the completion criteria for this dungeon has been met.
         * @type {Boolean}
         */
        this.completed = false;

        /**
         * How much longer before the dungeon is over.
         * @type {Number}
         */
        this.timeRemaining = config.timeLimitMinutes * 1000 * 60;

        this.timeUpTimeout = setTimeout(() => {
            // Time is up, end the dungeon.
            this.timeUpTimeout = null;

            this.evictAllPlayers();
        }, this.timeRemaining);
    }

    destroy() {
        clearTimeout(this.timeUpTimeout);

        this.board.destroy();

        this.dungeonManager = null;
        this.party = null;
    }

    removePlayerFromParty(player) {
        this.dungeonManager.removePlayerFromParty(player);
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
                    if (BoardsList
                        .boardsObject[exit.targetBoard]
                        .entrances[exit.targetEntrance]
                        === undefined) {
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

    addPlayers(players, timeLimitMinutes) {
        // Move the party members into a dungeon instance.
        players.forEach((player) => {
            // Reposition them to somewhere within the entrance bounds.
            const position = this.board.entrances["dungeon-start"].getRandomPosition();

            // Move the player to the board instance that was created.
            player.changeBoard(player.board, this.board, position.row, position.col);

            // Tell them the dungeon has started.
            player.socket.sendEvent(EventsList.start_dungeon, {
                timeLimitMinutes,
            });
        });
    }

    setCompleted() {
        this.completed = true;

        // Tell the players in this dungeon that it is completed.
    }

    evictAllPlayers() {
        // Send all players on the board to the entrance that this dungeon exits to.
        this.party.members.forEach((player) => {
            // Reposition them to somewhere within the entrance bounds.
            const position = this.evictionEntrance.getRandomPosition();

            // Move them out of this dungeon board.
            player.changeBoard(this.board, this.evictionBoard, position.row, position.col);
        });
    }

    emitDoorKeysToParty() {
        this.party.members.forEach((member) => {
            member.socket.sendEvent(EventsList.dungeon_door_keys, this.doorKeys);
        });
    }
}

module.exports = Dungeon;
