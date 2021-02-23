import PubSub from "pubsub-js";
import {
    ADD_ITEM, MODIFY_ITEM, MODIFY_INVENTORY_WEIGHT, HOTBAR_ITEM,
} from "../EventTypes";
import Utils from "../Utils";

const MAX_HOTBAR_SLOTS = 8;

class Inventory {
    items = [];

    // Need to keep a separate list for the hotbar as things can be rearranged.
    hotbar = [];

    weight = 0;

    maxWeight = 0;

    addToInventory(config) {
        this.items.push(config);

        PubSub.publish(ADD_ITEM, { new: config });

        // Add to the hotbar if there is any available space on it.
        if (this.hotbar.length < MAX_HOTBAR_SLOTS) {
            this.addToHotbar(config);
        }
    }

    addToHotbar(item) {
        this.hotbar.push(item);

        PubSub.publish(HOTBAR_ITEM);
    }

    removeFromHotbar(item) {
        this.hotbar = this.hotbar.filter((eachItem) => eachItem !== item);

        PubSub.publish(HOTBAR_ITEM);
    }

    modifyItem(config) {
        const item = this.items[config.slotIndex];

        if (!item) {
            Utils.warning("Cannot modify item in inventory. No slot index given. Config:", config);
            return;
        }

        if (config.quantity) {
            item.quantity = config.quantity;
            item.totalWeight = config.totalWeight;
        }
        else if (config.durability) {
            item.durability = config.durability;
        }
        else {
            Utils.warning("Cannot modify item in inventory. No quantity or durability given. Config:", config);
        }

        PubSub.publish(MODIFY_ITEM, { new: config });
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
