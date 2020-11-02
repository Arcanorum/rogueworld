
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

        // Add a self-destruct timer to pickups that are not in a dungeon.
        if(!this.board.dungeon){
            // A timer to auto destroy this item if it isn't picked up within the given time.
            this.lifespanTimeout = setTimeout(this.destroy.bind(this), 1000 * 60);
        }
    }

    onDestroy () {
        clearTimeout(this.lifespanTimeout);

        this.board.removePickup(this);

        super.onDestroy();
    }

    onDropped (droppedBy) {}

    onPickedUp (pickedUpBy) {}

    setItemType (moduleName) {
        this.ItemType = require('../../../items/' + moduleName);

        if(typeof this.ItemType !== "function"){
            Utils.error("Cannot set pickup item type, item type does not exist:", moduleName);
        }
    }

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

/**
 * The percent chance this item will be dropped when rolled from a mob drop list.
 * From 0 to 100 (percent), including 100 but not 0, as 0 would mean the item 
 * can never drop, so pointless to have it on a drop list.
 * @type {Number}
 */
Pickup.prototype.dropRate = 20;

Pickup.prototype.spawnRate = 20000;

module.exports = Pickup;

const Utils = require('../../../Utils');