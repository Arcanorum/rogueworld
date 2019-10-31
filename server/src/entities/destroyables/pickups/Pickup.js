
const Destroyable = require('../Destroyable');

class Pickup extends Destroyable {

    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Number} [config.durability = null] - How much durability this pickup (and its item form) has. Null durability items don't degrade.
     * @param {Number} [config.maxDurability = null] - How much durability this pickup (and its item form) can have.
     */
    constructor (config) {
        super(config);

        config.board.addPickup(this);

        this.durability = config.durability || null;

        this.maxDurability = config.maxDurability || config.durability || null;

        // A timer to auto destroy this item if it isn't picked up within the given time.
        this.lifespanTimeout = setTimeout(this.destroy.bind(this), 1000 * 60);
    }

    onDestroy () {
        clearTimeout(this.lifespanTimeout);

        this.board.removePickup(this);

        super.onDestroy();
    }

    onDropped (droppedBy) {}

    onPickedUp (pickedUpBy) {}

}

/**
 * The type of item to be added to the inventory of the character that picks this pickup up. The class itself, NOT an instance of it.
 * @type {Function}
 */
Pickup.prototype.ItemType = 'Item type not set.';

/**
 * If this entity is created by a spawner, this is a reference to it. The spawner itself will set this when it creates the entity.
 * @type {Spawner}
 */
Pickup.prototype.spawner = null;

module.exports = Pickup;