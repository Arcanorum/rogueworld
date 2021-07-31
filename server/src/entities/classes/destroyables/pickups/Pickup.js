const ItemConfig = require("../../../../inventory/ItemConfig");
const Destroyable = require("../Destroyable");

class Pickup extends Destroyable {
    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {ItemConfig} [config.itemConfig]
     */
    constructor(config) {
        // Add a self-destruct timer to pickups that are not in a dungeon.
        if (!config.board.dungeon) {
            // A timer to auto destroy this item if it isn't picked up within the given time.
            config.lifespan = 1000 * 60;
        }

        super(config);

        config.board.addPickup(this);

        this.itemConfig = config.itemConfig || new ItemConfig({ ItemType: this.ItemType });
    }

    onDestroy() {
        this.board.removePickup(this);

        super.onDestroy();
    }

    onDropped(droppedBy) {}

    onPickedUp(pickedUpBy) {}
}

Pickup.abstract = true;

/**
 * The type of item to be added to the inventory of the character that picks this pickup up. The class itself, NOT an instance of it.
 * Set in Item.assignPickupType on server start.
 * @type {Function}
 */
Pickup.prototype.ItemType = "Item type not set.";

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

/**
 * The configuration of the item that this pickup represents.
 * If not defined after instantiation, then it iwll use the defaults from the ItemType.
 * @type {ItemConfig}
 */
Pickup.prototype.itemConfig = null;

module.exports = Pickup;
