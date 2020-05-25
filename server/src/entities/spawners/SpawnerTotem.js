
const Spawner = require('./Spawner');

class SpawnerTotem extends Spawner {

    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Function} config.entityType - The type of entity that this spawner will create instances of.
     * @param {Number} [config.maxAtOnce=1] - The maximum amount of entities this spawner can have at once.
     * @param {Number} [config.spawnRate=1000] - How often this spawner creates a new entity, in ms.
     */
    constructor(config) {
        super(config);
    }

    /**
     * Gets a random position within the bounds of this spawner.
     * @returns {{row: Number, col: Number}}
     */
    getRandomPosition() {
        const keys = Object.keys(this.positionOffsets);

        return this.positionOffsets[keys[keys.length * Math.random() << 0]];
    }

}
module.exports = SpawnerTotem;

SpawnerTotem.prototype.positionOffsets = {
    u: { row: -1, col: 0 },
    d: { row: +1, col: 0 },
    l: { row: 0, col: -1 },
    r: { row: 0, col: +1 },
};