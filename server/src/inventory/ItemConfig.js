const { v4: uuidv4 } = require("uuid");
const Utils = require("../Utils");

class ItemConfig {
    /**
     * The main unit that all of the item related systems (inventory, bank, crafting, shops,
     * pickups) use to understand the form/configuration of a given item.
     * Can be passed around between these systems, such as to a pickup for it to hold as the item
     * it represents, or from the pickup to the inventory, or from inventory to bank, or where ever.
     * Does all necessary item type validation with the given properties, to avoid having to grab
     * and check the needed properties each time it is passed around.
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

        if (!config.ItemType) {
            Utils.warning("ItemConfig constructor, config.ItemType is not a valid item type.");
            throw new Error("Failed ItemConfig validation.");
        }

        // Check the type itself has quantity, in case the item config
        // has the wrong properties for the item type it is for.
        // Prevents quantity being set for things that are meant to be unstackable.
        if (config.quantity && this.ItemType.prototype.baseQuantity) {
            this.quantity = parseInt(config.quantity, 10);

            this.totalWeight = this.quantity * this.ItemType.prototype.unitWeight;
        }
        // Check the type itself has durability, in case the item config
        // has the wrong properties for the item type it is for.
        // Prevents durability being set for things that are meant to be stackable.
        else if (config.durability && this.ItemType.prototype.baseDurability) {
            this.durability = parseInt(config.durability, 10);
            this.maxDurability = parseInt(config.maxDurability || this.durability, 10);

            this.totalWeight = this.ItemType.prototype.unitWeight;
        }
        // Default to the base values for quantity or durability.
        // Used if no particular value is given to be used for a new item, so use the default set
        // for that item type. Useful for things like pickup spawners that are mostly the same.
        // Also handles the case where an item type has it's config swapped between stackable and
        // unstackable and a saved item in an account is then loaded with the old item config (and
        // therefore has the wrong properties set, i.e. quantity set for an unstackable), so it is
        // still able to fall back to the new default base value for that item type.
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
            Utils.warning("ItemConfig constructor, config does not have either `quantity` or `durability`, or either `baseQuantity` or `baseDurability` on the item type. Config:", config);
            throw new Error("Failed ItemConfig validation.");
        }
        if (config.weightReduce !== undefined) {
            this.modWeightReduce(config.weightReduce);
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

    /**
     * Useful for when needing to modify the config directly.
     * @param {Number} amount
     */
    modWeightReduce(amount) {
        if (!Number.isFinite(amount)) {
            return false;
        }
        this.weightReduce = this.weightReduce || 0;
        this.weightReduce += amount;
        this.weightReduce = Math.min(90, Math.max(0, Math.floor(this.weightReduce)));
        this.baseWeight = this.baseWeight || this.weight;
        this.totalWeight = this.ItemType.prototype.unitWeight
                      - (this.weightReduce / 100) * this.ItemType.prototype.unitWeight;
        return true;
    }
}

ItemConfig.prototype.MAX_QUANTITY = 99999;

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
