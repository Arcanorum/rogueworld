const ItemConfig = require("./ItemConfig.js");

class Inventory {
    constructor() {
        this.weight = 0;
        this.maxWeight = 1000;

        this.items = [];
    }

    print() {
        console.log("printing inventory:");
        this.items.forEach((item) => {
            console.log(item);
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
        this.items.splice(slotIndex);
    }

    /**
     *
     * @param {ItemConfig} config
     */
    canItemBeAdded(config) {
        const { ItemType } = config;

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

        console.log("updated total inventory weight, new weight:", this.weight);
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
        console.log("** inventory.addItem");

        console.log("before adding to inventory:", this.items);

        if (!(config instanceof ItemConfig)) {
            throw new Error("Cannot add item to inventory from a config that is not an instance of ItemConfig. Config:", config);
        }

        if (config.quantity) {
            let quantityToAdd = this.quantityThatCanBeAdded(config);

            console.log("quantity to add:", quantityToAdd);

            // Find if a stack for this type of item already exists.
            const found = this.items.find((item) => (
                (item instanceof config.ItemType)
                // Also check if the stack is not already full.
                && (item.itemConfig.quantity < item.itemConfig.MAX_QUANTITY)
            ));

            console.log("item stack already exists?:", found);

            // Add to the existing stack.
            if (found) {
                // Check there is enough space left in the stack to add these additional ones.
                if ((found.itemConfig.quantity + quantityToAdd) > found.itemConfig.MAX_QUANTITY) {
                    // Not enough space. Add what can be added and keep the rest where it is.

                    console.log("not enough space");

                    const availableQuantity = (
                        found.itemConfig.MAX_QUANTITY - found.itemConfig.quantity
                    );

                    console.log("available quantity:", availableQuantity);

                    // config.modQuantity(-availableQuantity);

                    // Add to the found stack.
                    found.modQuantity(+availableQuantity);

                    // Some of the quantity to add has now been added to an existing stack,
                    // so reduce the amount that will go into the new overflow stack.
                    quantityToAdd -= availableQuantity;
                    console.log("reduced from incoming stack, new availQuany:", quantityToAdd);

                    // console.log("  added to existing stack, found:", found.itemConfig);
                }
                else {
                    console.log("adding to existing stack:", config.quantity);
                    found.modQuantity(+quantityToAdd);

                    this.updateWeight();
                    console.log("after adding to quantity:", this.items);
                    // Don't want to add another item below, so exit now.
                    return;
                }
            }

            // Reduce the size of the incoming stack.
            config.modQuantity(-quantityToAdd);

            // Make a new stack with just the quantity that can fit in the available weight.
            this.items.push(new config.ItemType({
                itemConfig: new ItemConfig({
                    ItemType: config.ItemType,
                    quantity: quantityToAdd,
                }),
            }));
        }
        // Add as an unstackable.
        else {
            // Add the item to the inventory as a new entry as an unstackable.
            this.items.push(new config.ItemType({ itemConfig: config }));
        }

        this.updateWeight();

        console.log("after adding to inventory:", this.items);
    }
}

module.exports = Inventory;
