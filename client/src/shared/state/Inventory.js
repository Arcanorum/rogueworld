import PubSub from "pubsub-js";
import { ADD_ITEM, MODIFY_ITEM, MODIFY_INVENTORY_WEIGHT } from "../EventTypes";
import Utils from "../Utils";

class Inventory {
    items = [];

    hotbar = [];

    weight = 0;

    maxWeight = 0;

    addToInventory(config) {
        this.items.push(config);

        PubSub.publish(ADD_ITEM, { new: config });

        // Add to the hotbar if there is any available space on it.
    }

    addToHotbar() {

    }

    modifyItem(config) {
        console.log("modify");
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
