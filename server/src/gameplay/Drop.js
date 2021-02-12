const fs = require("fs");
const Pickup = require("../entities/destroyables/pickups/Pickup");
const Utils = require("../Utils");
const ItemsList = require("../ItemsList");

class Drop {
    constructor(config) {
        if (!ItemsList[config.itemName]) {
            Utils.error(`Cannot add to drop list. Drop item name "${config.itemName}" does not exist in the items list.
         Check the name of the item to add is correct, and that it is in the items list.`);
        }

        /**
         * The item pickup entity to be created when this item is dropped.
         * @type {Function}
         */
        this.pickupType = ItemsList[config.itemName].prototype.PickupType;

        if (typeof this.pickupType !== "function") {
            Utils.error("Cannot add to drop list, pickup entity is not a function/class. Is it disabled?:", config.itemName);
        }

        if (this.pickupType.prototype instanceof Pickup === false) {
            Utils.error(`Cannot add to drop list, imported entity type does not extend type Pickup. Config:${config}`);
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
            this.dropRate = this.pickupType.prototype.dropRate;
        }
    }
}

module.exports = Drop;
