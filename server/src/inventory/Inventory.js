const EventsList = require("../EventsList.js");
const ItemConfig = require("./ItemConfig.js");

class Inventory {
    constructor(owner) {
        this.owner = owner;

        this.weight = 0;
        this.maxWeight = 1000;

        this.items = [];
    }

    print() {
        console.log("printing inventory:");
        this.items.forEach((item) => {
            console.log(item.itemConfig);
        });
    }

    useItem(slotIndex) {
        const item = this.items[slotIndex];
        if (!item) return;

        const isStackable = !!item.quantity;

        this.items[slotIndex].use();

        if (isStackable && item.quantity < 1) {
            // The item was stackable, but now the stack is empty, so remove it.
            this.removeItemBySlotIndex(slotIndex);
        }
        else if (!isStackable && item.durability < 1) {
            // The item broke, so remove it.
            this.removeItemBySlotIndex(slotIndex);
        }
    }

    removeItemBySlotIndex(slotIndex) {
        if (!this.items[slotIndex]) return;

        // Let the item clean itself up first.
        this.items[slotIndex].destroy();

        // Remove it and squash the hole it left behind.
        // The items list shouldn't be holey.
        this.items.splice(slotIndex, 1);

        // Tell the player the item was removed from their inventory.
        this.owner.socket.sendEvent(EventsList.remove_item, slotIndex);
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
        this.weight = 0;

        this.items.forEach((item) => {
            this.weight += item.itemConfig.totalWeight;
        });

        // Tell the player their new inventory weight.
        this.owner.socket.sendEvent(EventsList.inventory_weight, this.weight);
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
                    found.modQuantity(+quantityToAdd);

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
            this.owner.socket.sendEvent(EventsList.add_item, {
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
            this.owner.socket.sendEvent(EventsList.add_item, {
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
}

module.exports = Inventory;
