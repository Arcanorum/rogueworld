const Spawner = require("./Spawner");

class SpawnerArea extends Spawner {
    /**
     * @param {Object} config
     * @param {Number} config.row - For SpawnAreas, this is the top row.
     * @param {Number} config.col - For SpawnAreas, this is the left col.
     * @param {Board} config.board
     * @param {Number} config.width - How many tiles wide.
     * @param {Number} config.height - How many tiles high.
     * @param {Function} config.entityType - The type of entity that this spawner will create instances of.
     * @param {Number} [config.maxAtOnce=1] - The maximum amount of entities this spawner can have at once.
     * @param {Number} [config.spawnRate=1000] - How often this spawner creates a new entity, in ms.
     */
    constructor(config) {
        super(config);

        this.top = config.row;
        this.bottom = config.row + config.height - 1;
        this.left = config.col;
        this.right = config.col + config.width - 1;
    }

    /**
     * Gets a random position within the bounds of this spawner.
     * @returns {{row: Number, col: Number}}
     */
    getRandomPosition() {
        return {
            row: Math.round(Math.random() * (this.top - this.bottom) + this.bottom),
            col: Math.round(Math.random() * (this.left - this.right) + this.right),
        };
    }
}
module.exports = SpawnerArea;
