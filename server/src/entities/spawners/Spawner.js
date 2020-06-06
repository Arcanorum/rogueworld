const Entity = require('../Entity');

class Spawner extends Entity {
    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Function} config.entityType - The type of entity that this spawner will create instances of.
     * @param {Number} [config.maxAtOnce=1] - The maximum amount of entities this spawner can have at once.
     * @param {Number} [config.spawnRate=20000] - How often this spawner creates a new entity, in ms.
     * @param {Boolean} [config.testing=undefined] - Is this spawner being used to spawn test entities. Useful for not having a spam of console logs for all of an entity type.
     * @param {String} [config.dropList=undefined] - Any special item drop list that the entities spawned should use instead of their class one, such as keys.
     */
    constructor(config) {
        super(config);

        this.EntityType = config.entityType;
        this.maxAtOnce = config.maxAtOnce || 0;
        this.spawnRate = config.spawnRate || config.entityType.prototype.spawnRate || 60000;
        if (this.spawnRate < 1) {
            Utils.error("Spawner with invalid spawnRate. Config:", config);
        }

        // Spawn dungeon entities immediately.
        if (this.board.dungeon) this.spawnRate = 1;

        this.currentlySpawned = 0;
        this.testing = config.testing;
        this.dropList = null;

        if (config.dropList) {
            const splitList = config.dropList.split(',\n');

            this.dropList = [];

            splitList.forEach((itemName) => {

                this.dropList.push(new Drop({
                    itemName: itemName,
                    dropRate: 100
                }));

            });
        }

        // Add this spawner to the list of spawners on the board it is on.
        config.board.spawners[this.id] = this;

        /**
         * A list of pending timeouts to call spawn.
         * Need to keep these so they can be cleaned up if the spawner is destroyed,
         * such as when a dungeon instance (and its map) is destroyed.
         * @type {Object}
         */
        this.spawnTimeouts = {};

        // Start the spawner.
        for (let i = 0; i < this.maxAtOnce; i += 1) {
            this.addSpawnTimeout();
        }
    }

    destroy() {
        // Prevent multiple destruction.
        if (this._destroyed === true) return;

        this._destroyed = true;

        this.board = null;

        Object.entries(this.spawnTimeouts).forEach((timeoutID) => {
            clearTimeout(timeoutID);
            delete this.spawnTimeouts[timeoutID];
        });
    }

    /**
     * Creates a timeout that will spawn an entity after the length of the spawn rate.
     * Tracks this timeout in the timeouts list.
     */
    addSpawnTimeout() {
        const timeoutID = setTimeout(() => {
            this.spawn.bind(this, timeoutID)();
        }, this.spawnRate);
        this.spawnTimeouts[timeoutID] = timeoutID;
    }

    spawn(timeoutID) {
        delete this.spawnTimeouts[timeoutID];

        // Check there can be any more.
        if (this.currentlySpawned >= this.maxAtOnce) return false;

        const randomPosition = this.getRandomPosition();

        /** @type {BoardTile} */
        const boardTile = this.board.grid[randomPosition.row][randomPosition.col];

        // Check if the tile is blocked by a blocking static.
        if (boardTile.isLowBlocked() === true) {
            // Restart the spawn.
            this.addSpawnTimeout();
            return false;
        }

        if (this.EntityType.prototype.checkSpawnCriteria(boardTile, World.dayPhase) === false) {
            // Restart the spawn.
            this.addSpawnTimeout();
            return false;
        }

        const entity = new this.EntityType(
            {
                row: randomPosition.row,
                col: randomPosition.col,
                board: this.board
            }
        );

        // If this spawner creates test entities, specify them here.
        if (this.testing === true) {
            entity.testing = true;
        }

        // If this spawner uses a specific drop list, specify it here.
        if (this.dropList !== null) {
            // Check it is an entity that should have a drop list.
            if (entity.dropList) {
                entity.dropList = this.dropList;
                // Make sure they can only drop one item, in case they are a key holder.
                entity.dropAmount = 1;

                // If they are spawned into a dungeon, add them to the dungeon key holders list, so they can
                // be killed when the dungeon resets, in case they would be locked out of their intended room.
                // if(this.isInDungeon === true){
                //     this.dungeon.keyHolders[entity.id] = entity;
                // }
            }
        }

        // Make sure this is a spawnable type of entity.
        if (entity.spawner === undefined) {
            Utils.warning("Trying to create an entity from a spawner that doesn't have a `spawner` property, type: " + entity.constructor.name);
        }
        else {
            entity.spawner = this;
        }

        this.currentlySpawned += 1;

        this.board.emitToNearbyPlayers(entity.row, entity.col, entity.EventsList.add_entity, entity.getEmittableProperties({}));

        return true;
    }

    /**
     * Called when an entity that was created by this spawner is destroyed, so the spawner knows to spawn another one.
     * @param {Entity} entityID
     */
    childDestroyed(entityID) {
        this.currentlySpawned -= 1;

        // If the destroyed child was in a dungeon, and has a drop list (probably for keys), then remove them from the key holder list.
        // if(this.isInDungeon === true){
        //     if(this.dropList !== null){
        //         delete this.dungeon.keyHolders[entityID];
        //     }
        // }

        // Only spawn dungeon entities once.
        if (!this.board.dungeon) {
            this.addSpawnTimeout();
        }
    }

    /**
     * Overwrite with specific functionality, such as with a bounds or next to a position
     */
    getRandomPosition() { }
}
module.exports = Spawner;

const Utils = require('../../Utils');
const World = require('../../World');
const Drop = require('../../gameplay/Drop');