import { warning } from '../../../../../shared/utils';
import PubSub from 'pubsub-js';
import {
    ADD_BANK_ITEM,
    REMOVE_BANK_ITEM,
    MODIFY_BANK_ITEM,
    MODIFY_BANK_WEIGHT,
    MODIFY_BANK_MAX_WEIGHT,
    MODIFY_BANK_MAX_WEIGHT_UPGRADE_COST,
} from '../EventTypes';
import ItemState from '../ItemState';

class Bank {
    items!: Array<ItemState>;
    weight!: number;
    maxWeight!: number;
    maxWeightUpgradeCost!: number;
    additionalMaxBankWeightPerUpgrade!: number;

    constructor() {
        this.init();
    }

    init() {
        this.items = [];

        this.weight = 0;

        this.maxWeight = 0;

        this.maxWeightUpgradeCost = 0;

        this.additionalMaxBankWeightPerUpgrade = 0;
    }

    setWeight(value: number) {
        this.weight = value;

        PubSub.publish(MODIFY_BANK_WEIGHT, { new: value });
    }

    setMaxWeight(value: number) {
        this.maxWeight = value;

        PubSub.publish(MODIFY_BANK_MAX_WEIGHT, { new: value });
    }

    setMaxWeightUpgradeCost(value: number) {
        this.maxWeightUpgradeCost = value;

        PubSub.publish(MODIFY_BANK_MAX_WEIGHT_UPGRADE_COST, { new: value });
    }

    addToBank(itemConfig: ItemState) {
        this.items.push(itemConfig);

        PubSub.publish(ADD_BANK_ITEM, itemConfig);
    }

    removeFromBank(slotIndex: number) {
        const item = this.items[slotIndex];

        if (!item) {
            warning('Cannot remove item from bank. Invalid slot index given. Config:', slotIndex);
            return;
        }

        this.items.splice(slotIndex, 1);

        // Update the slot indexes of the items.
        // The bank items aren't stored with a true slotIndex, but
        // the index it is added at is sent when added to the bank.
        this.items.forEach((eachItem, index) => {
            eachItem.slotIndex = index;
        });

        PubSub.publish(REMOVE_BANK_ITEM, item);
    }

    modifyItem(itemConfig: ItemState) {
        const item = this.items[itemConfig.slotIndex];

        if (!item) {
            warning('Cannot modify item in bank. Invalid slot index given. Config:', itemConfig);
            return;
        }

        if (itemConfig.quantity) {
            item.quantity = itemConfig.quantity;
            item.totalWeight = itemConfig.totalWeight;
        }
        else {
            warning('Cannot modify item in bank. No quantity given. Config:', itemConfig);
        }

        PubSub.publish(MODIFY_BANK_ITEM, { new: itemConfig });
    }
}

export default Bank;
