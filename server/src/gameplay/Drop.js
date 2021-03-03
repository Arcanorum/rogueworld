const Pickup = require("../entities/destroyables/pickups/Pickup");
const Utils = require("../Utils");
const ItemsList = require("../ItemsList");

class Drop {
    constructor(config) {
        if (!ItemsList.BY_NAME[config.itemName]) {
            Utils.error(`Cannot add to drop list. Drop item name "${config.itemName}" does not exist in the items list.
         Check the name of the item to add is correct, and that it is in the items list.`);
        }

        /**
         * The item pickup entity to be created when this item is dropped.
         * @type {Function}
         */
        this.PickupType = ItemsList.BY_NAME[config.itemName].prototype.PickupType;

        if (typeof this.PickupType !== "function") {
            Utils.error(`Cannot add to drop list, pickup entity is not a function/class. Is it disabled?: ${config.itemName}`);
        }

        if (this.PickupType.prototype instanceof Pickup === false) {
            Utils.error("Cannot add to drop list, imported entity type does not extend type Pickup. Config:", config);
        }

        if(config.quantity){
            if(!ItemsList.BY_NAME[config.itemName].prototype.baseQuantity){
                Utils.error("Cannot add to drop list, drop config specifies quantity for non-stackable item type. Config:", config);
            }
            this.quantity = config.quantity;
        }

        if(config.durability){
            if(!ItemsList.BY_NAME[config.itemName].prototype.baseDurability){
                Utils.error("Cannot add to drop list, drop config specifies durability for stackable item type. Config:", config);
            }
            this.durability = config.durability;
        }

        /**
         * How many separate chances to get the item.
         * @type {Number}
         */
        this.rolls = 1;
        // Use config if set.
        if (config.rolls !== undefined) {
            // Check it is valid.
            if (Number.isInteger(config.rolls) === false) Utils.error(`Mob item drop rolls must be an integer. Config:${config}`);
            if (config.rolls < 1) Utils.error("Mob item drop rolls must be greater than 1. Config:", config);

            this.rolls = config.rolls;
        }

        /**
         * The chance of getting the item on each roll.
         * @type {Numnber}
         */
        this.dropRate = 20;
        // Use config if set.
        if (config.dropRate !== undefined) {
            // Check it is valid.
            if (config.dropRate <= 0 || config.dropRate > 100) Utils.error(`Mob item drop rate must be greater than 0, up to 100, i.e. 40 => 40% chance. Config:${config}`);

            this.dropRate = config.dropRate;
        }
        // Otherwise use the item pickup default drop rate if it is defined.
        else {
            this.dropRate = this.PickupType.prototype.dropRate;
        }
    }
}

module.exports = Drop;
