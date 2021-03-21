const settings = require("../../settings.js");
const EventsList = require("../EventsList.js");
const ItemConfig = require("../inventory/ItemConfig.js");
const BankChest = require("../entities/statics/interactables/breakables/BankChest");
const Utils = require("../Utils.js");

class Bank {
    constructor(owner) {
        this.owner = owner;

        this.weight = 0;
        this.maxWeight = 1000;
        this.maxWeightUpgradeCost = (
            this.maxWeight * settings.BANK_MAX_WEIGHT_UPGRADE_COST_MULTIPLIER
        );

        /**
         * A list of the items in this bank account.
         * Only contains item configs for potential items, NOT actual Item class instances,
         * as they cannot be used, equipped etc. directly while in the bank.
         * @type {Array.<ItemConfig>}
         */
        this.items = [];
    }

    print() {
        console.log("printing bank:");
        this.items.forEach((item) => {
            console.log(item);
        });
    }

    buyMaxWeightUpgrade() {
        // Check the player has enough glory.
        if (this.owner.glory < this.maxWeightUpgradeCost) return;

        this.owner.modGlory(-this.maxWeightUpgradeCost);

        this.maxWeight += 100;

        // Tell the player their new max bank weight.
        this.owner.socket.sendEvent(EventsList.bank_max_weight, this.maxWeight);

        // Update the next cost based on the new max weight.
        this.maxWeightUpgradeCost = (
            this.maxWeight * settings.BANK_MAX_WEIGHT_UPGRADE_COST_MULTIPLIER
        );

        // Tell the player the next upgrade cost.
        this.owner.socket.sendEvent(
            EventsList.bank_max_weight_upgrade_cost,
            this.maxWeightUpgradeCost,
        );
    }

    /**
     * Returns all of the items in this bank, in a form that is ready to be emitted.
     * @returns {Object}
     */
    getEmittableProperties() {
        const emittableInventory = {
            weight: this.weight,
            maxWeight: this.maxWeight,
            maxWeightUpgradeCost: this.maxWeightUpgradeCost,
            items: [],
        };

        return emittableInventory;
    }

    /**
     *
     * @param {ItemConfig} config
     */
    canItemBeAdded(config) {
        if (!config) return false;

        // Check they are next to a bank terminal.
        if (!this.owner.isAdjacentToStaticType(BankChest.prototype.typeNumber)) return false;

        const { ItemType } = config;

        if (!ItemType) return false;

        if (config.quantity) {
            if (this.quantityThatCanBeAdded(config) > 0) return true;
            return false;
        }
        if (config.durability) {
            if ((this.weight + ItemType.prototype.unitWeight) > this.maxWeight) return false;
            return true;
        }

        // Not a stackable or unstackable somehow. Prevent adding.
        return false;
    }

    updateWeight() {
        const originalWeight = this.weight;
        this.weight = 0;

        this.items.forEach((item) => {
            this.weight += item.totalWeight;
        });

        // Only send if it has changed.
        if (this.weight !== originalWeight) {
            // Tell the player their new bank weight.
            this.owner.socket.sendEvent(EventsList.bank_weight, this.weight);
        }
    }

    quantityThatCanBeAdded(config) {
        // Check there is enough weight capacity for any of the incoming stack to be added.
        // Might not be able to fit all of it, but still add what can fit.
        const incomingUnitWeight = config.ItemType.prototype.unitWeight;

        // Skip the weight calculation if the item is weightless.
        // Allow adding the entire quantity.
        if (incomingUnitWeight <= 0) {
            return config.quantity;
        }

        const freeWeight = this.maxWeight - this.weight;
        const quantityThatCanFit = Math.floor(freeWeight / incomingUnitWeight);

        // Don't return more than is in the incoming stack.
        // More might be able to fit, but the stack doesn't
        // need all of the available weight.
        if (quantityThatCanFit >= config.quantity) {
            return config.quantity;
        }

        return quantityThatCanFit;
    }

    /**
     * @param {Number} inventorySlotIndex
     * @param {Number} quantity - Stackables only. How much of the stack to deposit.
     */
    depositItem(inventorySlotIndex, quantity) {
        console.log("depositItem:", inventorySlotIndex, quantity);
        /** @type {Item} The inventory item to deposit. */
        const inventoryItem = this.owner.inventory.items[inventorySlotIndex];
        if (!inventoryItem) return;

        const depositItemConfig = new ItemConfig({
            ItemType: inventoryItem.itemConfig.ItemType,
            quantity: inventoryItem.itemConfig.quantity,
            durability: inventoryItem.itemConfig.durability,
            maxDurability: inventoryItem.itemConfig.maxDurability,
        });

        // Check there is enough space to store all of the desired amount to deposit.
        // Should be done on the client, but double-check here too.
        if (!this.canItemBeAdded(depositItemConfig)) return;

        // Add if stackable.
        if (inventoryItem.itemConfig.ItemType.prototype.baseQuantity) {
            console.log("adding stackable");
            // When depositing a stackable, a quantity must be provided.
            if (!quantity) return;

            // TODO
        }
        // Add unstackable.
        else {
            console.log("adding unstackable");
            // When depositing an unstackable, a quantity must not be provided.
            if (quantity) return;

            const slotIndex = this.items.length;

            // Store the item config in the bank.
            this.items.push(depositItemConfig);

            // Remove it from the inventory.
            this.owner.inventory.removeItemBySlotIndex(inventorySlotIndex);

            // Tell the player a new item was added to their bank.
            this.owner.socket.sendEvent(EventsList.add_bank_item, {
                slotIndex,
                typeCode: depositItemConfig.ItemType.prototype.typeCode,
                id: depositItemConfig.id,
                durability: depositItemConfig.durability,
                maxDurability: depositItemConfig.maxDurability,
                totalWeight: depositItemConfig.totalWeight,
            });
        }

        this.updateWeight();

        // Add the data of the item being deposited to the bank.
        // this.addItem(inventoryItem, quantity);

        // this.owner.socket.sendEvent(this.owner.EventsList.bank_item_deposited, {
        //     index: bankSlotIndex,
        //     typeCode: inventoryItem.typeCode,
        //     durability: bankItem.durability,
        //     maxDurability: bankItem.maxDurability,
        //     quantity: bankItem.quantity,
        // });
    }

    /**
     *
     * @param {ItemConfig} config
     */
    addItem(config, quantity) {
        if (!(config instanceof ItemConfig)) {
            throw new Error("Cannot add item to bank from a config that is not an instance of ItemConfig. Config:", config);
        }

        if (config.quantity) {
            let quantityToAdd = this.quantityThatCanBeAdded(config);

            // Find if a stack for this type of item already exists.
            const found = this.items.find((item) => (
                (item instanceof config.ItemType)
                // Also check if the stack is not already full.
                && (item.quantity < item.MAX_QUANTITY)
            ));

            // Add to the existing stack.
            if (found) {
                // Check there is enough space left in the stack to add these additional ones.
                if ((found.itemConfig.quantity + quantityToAdd) > found.itemConfig.MAX_QUANTITY) {
                    // Not enough space. Add what can be added and keep the rest where it is.

                    const availableQuantity = (
                        found.itemConfig.MAX_QUANTITY - found.itemConfig.quantity
                    );

                    // Add to the found stack.
                    found.modQuantity(+availableQuantity);

                    // Some of the quantity to add has now been added to an existing stack,
                    // so reduce the amount that will go into the new overflow stack.
                    quantityToAdd -= availableQuantity;
                }
                else {
                    // Enough space. Add them all.
                    found.modQuantity(+quantityToAdd);

                    // Reduce the size of the incoming stack.
                    config.modQuantity(-quantityToAdd);

                    this.updateWeight();
                    // Don't want to add another item below, so exit now.
                    return;
                }
            }

            // Reduce the size of the incoming stack.
            config.modQuantity(-quantityToAdd);

            const slotIndex = this.items.length;

            // Make a new stack with just the quantity that can fit in the available weight.
            const item = new ItemConfig({
                ItemType: config.ItemType,
                quantity: quantityToAdd,
            });

            this.items.push(item);

            // Tell the player a new item was added to their bank.
            this.owner.socket.sendEvent(EventsList.add_bank_item, {
                slotIndex,
                typeCode: item.typeCode,
                id: item.itemConfig.id,
                quantity: item.itemConfig.quantity,
                totalWeight: item.itemConfig.totalWeight,
            });

            // If it is a stackable, check if there is any of the stack left in the inventory.
            if (quantity && inventoryItem.itemConfig.quantity < 1) {
                this.inventory.removeQuantityByItemType(
                    quantity,
                    inventoryItem.itemConfig.ItemType,
                );
            }
        }
        // Add as an unstackable.
        else {
            const slotIndex = this.items.length;

            // Add the item to the bank as a new entry as an unstackable.
            this.items.push(config);

            // Tell the player a new item was added to their bank.
            this.owner.socket.sendEvent(EventsList.add_bank_item, {
                slotIndex,
                typeCode: config.typeCode,
                id: config.itemConfig.id,
                durability: config.itemConfig.durability,
                maxDurability: config.itemConfig.maxDurability,
                totalWeight: config.itemConfig.totalWeight,
            });
        }

        this.updateWeight();
    }

    removeItemBySlotIndex(slotIndex) {
        if (!this.items[slotIndex]) return;

        // Remove it and squash the hole it left behind.
        // The items list shouldn't be holey.
        this.items.splice(slotIndex, 1);

        // Tell the player the item was removed from their bank.
        this.owner.socket.sendEvent(EventsList.remove_bank_item, slotIndex);
    }

    removeQuantityByItemType(quantity, ItemType) {
        // Check it is actually a stackable.
        if (!ItemType.prototype.baseQuantity) return;

        // Find an item in the bank of the given type.
        const foundIndex = this.items.findIndex((item) => item.ItemType === ItemType);

        const foundItem = this.items[foundIndex];

        if (!foundItem) return;

        // Reduce the quantity.
        foundItem.modQuantity(-quantity);

        // Check if there is anything left in the stack.
        if (foundItem.quantity < 1) {
            this.removeItemBySlotIndex(foundIndex);
        }

        this.updateWeight();
    }
}

module.exports = Bank;
