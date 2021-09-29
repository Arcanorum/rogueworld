const Entity = require("../Entity");
const Utils = require("../../../Utils");
const ItemConfig = require("../../../inventory/ItemConfig");

class Spawner extends Entity {
    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Function} config.EntityType - The type of entity that this spawner will create instances of.
     * @param {Number} [config.maxAtOnce=1] - The maximum amount of entities this spawner can have at once.
     * @param {Number} [config.spawnRate=20000] - How often this spawner creates a new entity, in ms.
     * @param {Boolean} [config.testing=undefined] - Is this spawner being used to spawn test entities. Useful for not having a spam of console logs for all of an entity type.
     * @param {Object} [config.itemConfig=undefined] - PICKUPS ONLY. The config of the item that any pickups spawned represent.
     */
    constructor(config) {
        super(config);

        this.EntityType = config.EntityType;

        this.maxAtOnce = config.maxAtOnce || 0;

        this.spawnRate = 2000;// config.spawnRate || config.EntityType.prototype.spawnRate || 60000;
        if (this.spawnRate < 1) {
            Utils.error("Spawner with invalid spawnRate. Config:", config);
        }

        if (this.board.dungeon) {
            // Spawn dungeon entities immediately.
            this.spawnRate = 1;

            // Only add this property to entities in dungeons.
            this.dungeonKeys = config.dungeonKeys || null;
        }

        this.currentlySpawned = 0;

        this.testing = config.testing;

        if (config.itemConfig) {
            this.itemConfig = config.itemConfig;
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

    onDestroy() {
        Object.entries(this.spawnTimeouts).forEach((timeoutID) => {
            clearTimeout(timeoutID);
            delete this.spawnTimeouts[timeoutID];
        });

        super.onDestroy();
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

        const spawnCriteriaMet = this.EntityType.prototype.checkSpawnCriteria(
            boardTile,
            this.board.dayPhase,
        );

        if (spawnCriteriaMet === false) {
            // Restart the spawn.
            this.addSpawnTimeout();
            return false;
        }

        const entity = new this.EntityType(
            {
                row: randomPosition.row,
                col: randomPosition.col,
                board: this.board,
            },
        );

        // If this spawner creates test entities, specify them here.
        if (this.testing === true) {
            entity.testing = true;
        }

        // Pickups can have an item config passed to them to customise the pickup contents.
        if (this.itemConfig) {
            entity.itemConfig = this.itemConfig;

            // Need to create the item config new each time, or different
            // pickups will share the same config which can be mutated.
            entity.itemConfig = new ItemConfig({
                ItemType: this.itemConfig.ItemType,
                quantity: this.itemConfig.quantity,
                durability: this.itemConfig.durability,
            });
        }

        if (this.dungeonKeys) entity.dungeonKeys = this.dungeonKeys;

        // Make sure this is a spawnable type of entity.
        if (entity.spawner === undefined) {
            Utils.warning(`Trying to create an entity from a spawner that doesn't have a \`spawner\` property, type: ${entity.constructor.name}`);
        }
        else {
            entity.spawner = this;
        }

        this.currentlySpawned += 1;

        entity.emitToNearbyPlayers();

        return true;
    }

    /**
     * Called when an entity that was created by this spawner is destroyed, so the spawner knows to spawn another one.
     * @param {Entity} entityID
     */
    childDestroyed(entityID) {
        this.currentlySpawned -= 1;

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

Spawner.abstract = true;

const Drop = require("../../../gameplay/Drop");
