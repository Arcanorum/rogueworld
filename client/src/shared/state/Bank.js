import PubSub from "pubsub-js";
import {
    ADD_BANK_ITEM, REMOVE_BANK_ITEM, MODIFY_BANK_ITEM,
} from "../EventTypes";
import Utils from "../Utils";

class Bank {
    constructor() {
        this.init();
    }

    init() {
        this.items = [];

        this.weight = 0;

        this.maxWeight = 0;
    }

    addToBank(itemConfig) {
        this.items.push(itemConfig);

        PubSub.publish(ADD_BANK_ITEM, itemConfig);
    }

    removeFromBank(slotIndex) {
        const item = this.items[slotIndex];

        if (!item) {
            Utils.warning("Cannot remove item from bank. Invalid slot index given. Config:", slotIndex);
            return;
        }

        this.items.splice(slotIndex, 1);

        // Update the slot indexes of the items.
        this.items.forEach((eachItem, index) => {
            eachItem.slotIndex = index;
        });

        PubSub.publish(REMOVE_BANK_ITEM, item);
    }

    modifyItem(itemConfig) {
        const item = this.items[itemConfig.slotIndex];

        if (!item) {
            Utils.warning("Cannot modify item in bank. Invalid slot index given. Config:", itemConfig);
            return;
        }

        if (itemConfig.quantity) {
            item.quantity = itemConfig.quantity;
            item.totalWeight = itemConfig.totalWeight;
        }
        else {
            Utils.warning("Cannot modify item in bank. No quantity given. Config:", itemConfig);
        }

        PubSub.publish(MODIFY_BANK_ITEM, { new: itemConfig });
    }
}

export default Bank;
