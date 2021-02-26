const { v4: uuidv4 } = require("uuid");
const Utils = require("../Utils");

class ItemConfig {
    /**
     * A way to pass around a configuration for an item to different systems.
     * Can be passed straight to a pickup for it to hold as the item it represents, or from the
     * pickup to the inventory, or bank, or where ever.
     * Avoids having to grab and check the needed properties each time it is passed around.
     * @param {Object} config
     * @param {Function} config.ItemType - The class/type of this item (NOT an instance).
     * @param {Number} [config.quantity]
     * @param {Number} [config.durability]
     * @param {Number} [config.maxDurability]
     */
    constructor(config) {
        this.ItemType = config.ItemType;

        // Add a unique id to stop React crying when this item is used in displaying a list...
        this.id = uuidv4();

        if (!config.ItemType) Utils.error("ItemConfig constructor, config.ItemType is not a valid item type.");

        if (config.quantity) {
            // Check the type itself has quantity, in case the item config
            // has the wrong properties for the item type it is for.
            // Prevents quantity being set for things that are meant to be unstackable.
            if (!this.ItemType.prototype.baseQuantity) {
                Utils.error("Cannot create stackable item config, as given item type does not have a base quantity. Check it is actually a stackable. Config:", config);
            }
            this.quantity = parseInt(config.quantity, 10);

            this.totalWeight = this.quantity * this.ItemType.prototype.unitWeight;
        }
        else if (config.durability) {
            // Check the type itself has durability, in case the item config
            // has the wrong properties for the item type it is for.
            // Prevents durability being set for things that are meant to be stackable.
            if (!this.ItemType.prototype.baseDurability) {
                Utils.error("Cannot create unstackable item config, as given item type does not have a base durability. Check it is actually an unstackable. Config:", config);
            }
            this.durability = parseInt(config.durability, 10);
            this.maxDurability = parseInt(config.maxDurability || this.durability, 10);

            this.totalWeight = this.ItemType.prototype.unitWeight;
        }
        // Default to the base values for quantity or durability.
        else if (this.ItemType.prototype.baseQuantity) {
            this.quantity = this.ItemType.prototype.baseQuantity;

            this.totalWeight = this.quantity * this.ItemType.prototype.unitWeight;
        }
        else if (this.ItemType.prototype.baseDurability) {
            this.durability = this.ItemType.prototype.baseDurability;
            this.maxDurability = this.durability;

            this.totalWeight = this.ItemType.prototype.unitWeight;
        }
        else {
            Utils.error("ItemConfig constructor, config does not have either `quantity` or `durability`, or either `baseQuantity` or `baseDurability` on the item type. Config:", config);
        }
    }

    /**
     * Useful for when needing to modify the config directly.
     * @param {Number} amount
     */
    modQuantity(amount) {
        this.quantity += amount;
        this.quantity = Math.floor(this.quantity);
        // Caclulate the new weight.
        this.totalWeight = Math.floor(this.quantity * this.ItemType.prototype.unitWeight);
    }

    /**
     * Useful for when needing to modify the config directly.
     * @param {Number} amount
     */
    modDurability(amount) {
        this.durability += amount;
        this.durability = Math.floor(this.durability);
    }

    destroy() {
        this.ItemType = null;
        this.id = null;
        this.quantity = null;
        this.durability = null;
        this.maxDurability = null;
        this.totalWeight = 0;
    }
}

ItemConfig.prototype.MAX_QUANTITY = 9999;

/**
 * The size of the stack of this item.
 * @type {Number|null}
 */
ItemConfig.prototype.quantity = null;

/**
 * How much durability this item has.
 * @type {Number|null}
 */
ItemConfig.prototype.durability = null;

/**
 * How much durability this item can have. Can change, such as when crafted by a player with levels in the crafting stat used.
 * @type {Number|null}
 */
ItemConfig.prototype.maxDurability = null;

/**
 * How much this item (or each unit of a stack) contributes to the total weight of the owner.
 * @type {Number}
 */
ItemConfig.prototype.totalWeight = 0;

module.exports = ItemConfig;
