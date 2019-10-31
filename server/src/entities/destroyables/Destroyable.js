
const Entity = require('../Entity');

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
    }

    getEmittableProperties (properties) {
        //console.log("*  *   props:", properties);
        properties.id = this.id;
        properties.typeNumber = this.typeNumber;
        properties.row = this.row;
        properties.col = this.col;
        return properties;
    }

    /**
     * Remove this entity from the game world completely, and allow it to be GCed.
     * Any specific destruction functionality should be added to onDestroy, which is called from this method.
     */
    destroy () {
        // Prevent multiple destruction of entities.
        if(this._destroyed === true) return;

        this._destroyed = true;

        this.onDestroy();
    }

    /**
     * Specific destruction functionality. If overwritten, should still be chained from the caller up to this.
     */
    onDestroy () {
        // Tell players around this entity to remove it.
        this.board.emitToNearbyPlayers(this.row, this.col, this.EventsList.remove_entity, this.id);

        // If this entity was created by a spawner, then tell the spawner this this entity is being destroyed.
        if(this.spawner !== null){
            this.spawner.childDestroyed(this.id);
        }

        this.board.removeDestroyable(this);
    }

}

module.exports = Destroyable;