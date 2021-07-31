const Entity = require("../Entity");

// TODO: rename destroyables to spawnables?
class Destroyable extends Entity {
    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     */
    constructor(config) {
        super(config);

        /**
         * If this entity is created by a spawner, this is a reference to it. The spawner itself will set this when it creates the entity.
         * @type {Spawner}
         */
        this.spawner = null;

        config.board.addDestroyable(this);

        if (Number.isInteger(config.lifespan) === true) {
            this.lifespanTimeout = setTimeout(this.destroy.bind(this), config.lifespan);
        }
    }

    getEmittableProperties(properties) {
        properties.id = this.id;
        properties.typeNumber = this.typeNumber;
        properties.row = this.row;
        properties.col = this.col;
        return properties;
    }

    onDestroy() {
        clearTimeout(this.lifespanTimeout);

        // Tell players around this entity to remove it.
        this.board.emitToNearbyPlayers(this.row, this.col, this.EventsList.remove_entity, this.id);

        // If this entity was created by a spawner, then tell the spawner this this entity is being destroyed.
        if (this.spawner !== null) {
            this.spawner.childDestroyed(this.id);
        }

        this.board.removeDestroyable(this);

        super.onDestroy();
    }
}

Destroyable.abstract = true;

module.exports = Destroyable;
