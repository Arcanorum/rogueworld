import PubSub from "pubsub-js";
import {
    ADD_ITEM, MODIFY_ITEM, MODIFY_INVENTORY_WEIGHT, HOTBAR_ITEM, REMOVE_ITEM,
} from "../EventTypes";
import Utils from "../Utils";

class Inventory {
    items = [];

    // Need to keep a separate list for the hotbar as things can be rearranged.
    hotbar = [];

    MAX_HOTBAR_SLOTS = 8;

    holding = null;

    clothing = null;

    ammunition = null;

    weight = 0;

    maxWeight = 0;

    addToInventory(itemConfig) {
        this.items.push(itemConfig);

        PubSub.publish(ADD_ITEM, itemConfig);

        // Add to the hotbar if there is any available space on it.
        if (this.hotbar.length < this.MAX_HOTBAR_SLOTS) {
            this.addToHotbar(itemConfig);
        }
    }

    removeFromInventory(slotIndex) {
        const item = this.items[slotIndex];

        if (!item) {
            Utils.warning("Cannot remove item from inventory. Invalid slot index given. Config:", slotIndex);
            return;
        }

        this.items.splice(slotIndex, 1);

        PubSub.publish(REMOVE_ITEM, item);

        // Remove it from the hotbar if it was on it.
        this.removeFromHotbar(item);
    }

    addToHotbar(itemConfig) {
        if (this.hotbar.length >= this.MAX_HOTBAR_SLOTS) return;

        this.hotbar.push(itemConfig);

        PubSub.publish(HOTBAR_ITEM);
        PubSub.publish(MODIFY_ITEM);
    }

    removeFromHotbar(itemConfig) {
        this.hotbar = this.hotbar.filter((eachItem) => eachItem !== itemConfig);

        PubSub.publish(HOTBAR_ITEM);
        PubSub.publish(MODIFY_ITEM);
    }

    modifyItem(itemConfig) {
        const item = this.items[itemConfig.slotIndex];

        if (!item) {
            Utils.warning("Cannot modify item in inventory. Invalid slot index given. Config:", itemConfig);
            return;
        }

        if (itemConfig.quantity) {
            item.quantity = itemConfig.quantity;
            item.totalWeight = itemConfig.totalWeight;
        }
        else if (itemConfig.durability) {
            item.durability = itemConfig.durability;
        }
        else {
            Utils.warning("Cannot modify item in inventory. No quantity or durability given. Config:", itemConfig);
        }

        PubSub.publish(MODIFY_ITEM, { new: itemConfig });
    }

    setWeight(value) {
        this.weight = value;

        PubSub.publish(MODIFY_INVENTORY_WEIGHT, { new: value });
    }

    setMaxWeight(value) {
        this.maxWeight = value;
    }
}

export default Inventory;
