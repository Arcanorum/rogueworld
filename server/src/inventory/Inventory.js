const settings = require("../../settings.js");
const EventsList = require("../EventsList.js");
const Utils = require("../Utils.js");
const ItemConfig = require("./ItemConfig.js");

class Inventory {
    constructor(owner) {
        this.owner = owner;

        this.weight = 0;
        this.maxWeight = settings.MAX_INVENTORY_WEIGHT || 1000;

        /**
         * A list of the items in this bank account.
         * Contains actual Item class instances, that can be used, equipped etc. directly.
         * @type {Array.<Item>}
         */
        this.items = [];
    }

    print() {
        console.log("printing inventory:");
        this.items.forEach((item) => {
            console.log(item.itemConfig);
        });
    }

    /**
     * Returns all of the items in this inventory, in a form that is ready to be emitted.
     * @returns {Object}
     */
    getEmittableProperties() {
        const emittableInventory = {
            weight: this.weight,
            maxWeight: this.maxWeight,
            items: [],
        };

        // let item;

        // TODO: items refactor, move to inventory class
        // for (const slotKey in this.inventory) {
        //     if (this.inventory.hasOwnProperty(slotKey) === false) continue;
        //     // Skip empty slots.
        //     if (this.inventory[slotKey] === null) continue;
        //     item = this.inventory[slotKey];
        //     emittableInventory.push({
        //         typeCode: item.typeCode, slotKey: item.slotKey, durability: item.durability, maxDurability: item.maxDurability,
        //     });
        // }

        return emittableInventory;
    }

    /**
     *
     * @param {ItemConfig} config
     */
    canItemBeAdded(config) {
        if (!config) return false;

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
            this.weight += item.itemConfig.totalWeight;
        });

        // Only send if it has changed.
        if (this.weight !== originalWeight) {
            // Tell the player their new inventory weight.
            this.owner.socket.sendEvent(EventsList.inventory_weight, this.weight);
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
     *
     * @param {ItemConfig} config
     */
    addItem(config) {
        if (!(config instanceof ItemConfig)) {
            throw new Error("Cannot add item to inventory from a config that is not an instance of ItemConfig. Config:", config);
        }

        if (config.quantity) {
            let quantityToAdd = this.quantityThatCanBeAdded(config);

            // Find if a stack for this type of item already exists.
            const found = this.items.find((item) => (
                (item instanceof config.ItemType)
                // Also check if the stack is not already full.
                && (item.itemConfig.quantity < item.itemConfig.MAX_QUANTITY)
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
            const item = new config.ItemType({
                itemConfig: new ItemConfig({
                    ItemType: config.ItemType,
                    quantity: quantityToAdd,
                }),
                slotIndex,
                owner: this.owner,
            });

            this.items.push(item);

            // Tell the player a new item was added to their inventory.
            this.owner.socket.sendEvent(EventsList.add_inventory_item, {
                slotIndex,
                typeCode: item.typeCode,
                id: item.itemConfig.id,
                quantity: item.itemConfig.quantity,
                totalWeight: item.itemConfig.totalWeight,
            });
        }
        // Add as an unstackable.
        else {
            const slotIndex = this.items.length;

            // Add the item to the inventory as a new entry as an unstackable.
            const item = new config.ItemType({
                itemConfig: config,
                slotIndex,
                owner: this.owner,
            });

            this.items.push(item);

            // Tell the player a new item was added to their inventory.
            this.owner.socket.sendEvent(EventsList.add_inventory_item, {
                slotIndex,
                typeCode: item.typeCode,
                id: item.itemConfig.id,
                durability: item.itemConfig.durability,
                maxDurability: item.itemConfig.maxDurability,
                totalWeight: item.itemConfig.totalWeight,
            });
        }

        this.updateWeight();
    }

    useItem(slotIndex) {
        const item = this.items[slotIndex];
        if (!item) return;

        item.use();

        this.updateWeight();
    }

    removeItemBySlotIndex(slotIndex) {
        if (!this.items[slotIndex]) return;

        // Let the item clean itself up first.
        this.items[slotIndex].destroy();

        // Remove it and squash the hole it left behind.
        // The items list shouldn't be holey.
        this.items.splice(slotIndex, 1);

        // Update the slot indexes of the items.
        this.items.forEach((item, index) => {
            item.slotIndex = index;
        });

        // Tell the player the item was removed from their inventory.
        this.owner.socket.sendEvent(EventsList.remove_inventory_item, slotIndex);

        this.updateWeight();
    }

    removeQuantityFromSlot(slotIndex, quantity) {
        const item = this.items[slotIndex];
        if (!item) return;

        // Check it is actually a stackable.
        if (!item.itemConfig.quantity) return;

        // The quantity to remove cannot be higher than the quantity in the stack.
        if (quantity > item.itemConfig.quantity) {
            quantity = item.itemConfig.quantity;
            Utils.warning("Quantity to remove should not be greater than the quantity in the slot.");
        }

        // Reduce the quantity.
        item.modQuantity(-quantity);

        this.updateWeight();
    }

    removeQuantityByItemType(quantity, ItemType) {
        // Check it is actually a stackable.
        if (!ItemType.prototype.baseQuantity) return;

        // Find an item in the inventory of the given type.
        const found = this.items.find((item) => item.itemConfig.ItemType === ItemType);

        if (!found) return;

        // Reduce the quantity.
        found.modQuantity(-quantity);

        this.updateWeight();
    }

    dropItem(slotIndex, quantity) {
        const item = this.items[slotIndex];
        if (!item) return;

        const { owner } = this;

        const boardTile = owner.getBoardTile();

        // Check the board tile the player is standing on doesn't already have an item or interactable on it.
        if (boardTile.isLowBlocked() === true) {
            // TODO: figure out what to do about this.
            // clientSocket.sendEvent(EventsList.cannot_drop_here);
            return;
        }

        // If no pickup type set, destroy the item without leaving a pickup on the ground.
        if (!item.PickupType) {
            this.removeItemBySlotIndex(slotIndex);
            return;
        }

        // If a quantity to drop was given, only drop that amount, and keep the rest in the inventory.
        if (quantity && item.itemConfig.quantity && quantity < item.itemConfig.quantity) {
            // Remove from the stack.
            item.modQuantity(-quantity);

            // Add a pickup entity of that item to the board,
            // with only the given quantity.
            new item.PickupType({
                row: owner.row,
                col: owner.col,
                board: owner.board,
                itemConfig: new ItemConfig({
                    ItemType: item.itemConfig.ItemType,
                    quantity,
                }),
            }).emitToNearbyPlayers();
        }
        // Drop the whole thing.
        else {
            // Add a pickup entity of that item to the board.
            new item.PickupType({
                row: owner.row,
                col: owner.col,
                board: owner.board,
                itemConfig: item.itemConfig,
            }).emitToNearbyPlayers();

            this.removeItemBySlotIndex(slotIndex);
        }

        this.updateWeight();

        owner.socket.sendEvent(EventsList.item_dropped);
    }

    /**
     * Drops all items in this inventory to the ground as pickups.
     */
    dropAllItems() {
        // Don't need to check the board tile to drop on, as
        // if they player is already stood on it, it is valid.
        const { owner } = this;

        this.items.forEach((item) => {
            // If no pickup type set, destroy the item without leaving a pickup on the ground.
            if (!item.PickupType) {
                this.removeItemBySlotIndex(item.slotIndex);
                return;
            }

            // Add a pickup entity of that item to the board.
            new item.PickupType({
                row: owner.row,
                col: owner.col,
                board: owner.board,
                itemConfig: item.itemConfig,
            }).emitToNearbyPlayers();

            // Let the item clean itself up.
            item.destroy();
        });

        // Reset the inventory.
        this.items = [];

        // Tell the player all items were removed from their inventory.
        this.owner.socket.sendEvent(EventsList.remove_all_inventory_items);

        this.updateWeight();
    }
}

module.exports = Inventory;
