import { warning } from '../../../../../shared/utils';
import PubSub from 'pubsub-js';
import {
    ADD_INVENTORY_ITEM,
    MODIFY_INVENTORY_ITEM,
    MODIFY_INVENTORY_WEIGHT,
    HOTBAR_ITEM,
    REMOVE_INVENTORY_ITEM,
    HOLDING_ITEM,
    AMMUNITION_ITEM,
    CLOTHING_ITEM,
    REMOVE_ALL_INVENTORY_ITEMS,
} from '../EventTypes';
import ItemConfig from '../ItemState';
import Config from '../Config';

class Inventory {
    items!: Array<ItemConfig>;

    /**
     * A separate list of items for the hotbar, as things can be rearranged, so just using the
     * slotIndex from the items won't be enough.
     */
    hotbar!: Array<ItemConfig>;

    MAX_HOTBAR_SLOTS!: 8;

    holding!: ItemConfig | null;

    clothing!: ItemConfig | null;

    ammunition!: ItemConfig | null;

    weight!: number;

    maxWeight!: number;

    /** Whether usable items will be automatically added to the hotbar when picked up if there is a free hotbar slot. */
    autoAddToHotbar!: boolean;

    userAccountId!: string | null;

    loadHotBarRequest!: string;

    constructor() {
        this.init();
    }

    init() {
        this.items = [];

        this.hotbar = [];

        this.MAX_HOTBAR_SLOTS = 8;

        this.holding = null;

        this.clothing = null;

        this.ammunition = null;

        this.weight = 0;

        this.maxWeight = 0;

        this.autoAddToHotbar = true;

        this.userAccountId = null;

        this.loadHotBarRequest = '';
    }

    setItems(itemConfigs: Array<ItemConfig>) {
        this.items = itemConfigs;
    }

    addToInventory(itemConfig: ItemConfig) {
        this.items.push(itemConfig);

        PubSub.publish(ADD_INVENTORY_ITEM, itemConfig);

        // Only add automatically if the setting for it is set.
        if (this.autoAddToHotbar) {
            this.addToHotbar(itemConfig);
        }
    }

    removeFromInventory(slotIndex: number) {
        const item = this.items[slotIndex];

        if (!item) {
            warning('Cannot remove item from inventory. Invalid slot index given. Config:', slotIndex);
            return;
        }

        this.items.splice(slotIndex, 1);

        // Update the slot indexes of the items.
        this.items.forEach((eachItem, index) => {
            eachItem.slotIndex = index;
        });

        PubSub.publish(REMOVE_INVENTORY_ITEM, item);

        // Remove it from the hotbar if it was on it.
        this.removeFromHotbar(item);
    }

    removeAllFromInventory() {
        this.items.forEach((item) => {
            // Remove it from the hotbar if it was on it.
            this.removeFromHotbar(item);
        });

        // Reset the inventory.
        this.items = [];

        PubSub.publish(REMOVE_ALL_INVENTORY_ITEMS);
    }

    addToHotbar(itemConfig: ItemConfig) {
        // Don't add to the hotbar if there is no available space on it.
        if (this.hotbar.length >= this.MAX_HOTBAR_SLOTS) return;

        // Only add if it is usable.
        if (!Config.ItemTypes[itemConfig.typeCode].hasUseEffect) return;

        this.hotbar.push(itemConfig);
        PubSub.publish(HOTBAR_ITEM);
        PubSub.publish(MODIFY_INVENTORY_ITEM);
        if (this.userAccountId !== null) {
            this.saveHotbar();
        }
    }

    removeFromHotbar(itemConfig: ItemConfig) {
        this.hotbar = this.hotbar.filter((eachItem) => eachItem !== itemConfig);
        PubSub.publish(HOTBAR_ITEM);
        PubSub.publish(MODIFY_INVENTORY_ITEM);
        if (this.userAccountId !== null) {
            this.saveHotbar();
        }
    }

    getHotbarItemIds() {
        // Generate an array of strings from the item ids.
        return this.hotbar.map((itemConfig) => itemConfig.id);
    }

    saveHotbar() {
        const hotbarItemIds = this.getHotbarItemIds();
        window.localStorage.setItem(this.loadHotBarRequest, JSON.stringify(hotbarItemIds));
    }

    defaultHotBar() {
        this.items.forEach((itemConfig) => {
            this.addToHotbar(itemConfig);
        });
    }

    loadHotbar(accountId: string) {
        this.userAccountId = accountId;
        this.loadHotBarRequest = `${this.userAccountId}_hotbar`;
        const loadStorageHotbar = window.localStorage.getItem(this.loadHotBarRequest);
        // If the session does not exist or user is not logged in
        if (this.userAccountId === null || loadStorageHotbar === null) {
            this.defaultHotBar();
            return;
        }
        this.populateInventoryToHotbar(JSON.parse(loadStorageHotbar));
    }

    populateInventoryToHotbar(savedHotbarItemIds: Array<string>) {
        savedHotbarItemIds.forEach((savedItemId) => {
            this.items.forEach((itemConfig) => {
                if (savedItemId === itemConfig.id) {
                    this.addToHotbar(itemConfig);
                }
            });
        });
    }

    modifyItem(itemConfig: ItemConfig) {
        const item = this.items[itemConfig.slotIndex];

        if (!item) {
            warning('Cannot modify item in inventory. Invalid slot index given. Config:', itemConfig);
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
            warning('Cannot modify item in inventory. No quantity or durability given. Config:', itemConfig);
        }

        PubSub.publish(MODIFY_INVENTORY_ITEM, { new: itemConfig });
    }

    setWeight(value: number) {
        this.weight = value;

        PubSub.publish(MODIFY_INVENTORY_WEIGHT, { new: value });
    }

    setMaxWeight(value: number) {
        this.maxWeight = value;
    }

    setHolding(value: ItemConfig | null) {
        // Allow slot index of 0 (falsy).
        this.holding = value;

        PubSub.publish(HOLDING_ITEM, value);
    }

    setAmmunition(value: ItemConfig | null) {
        // Allow slot index of 0 (falsy).
        this.ammunition = value;

        PubSub.publish(AMMUNITION_ITEM, value);
    }

    setClothing(value: ItemConfig | null) {
        // Allow slot index of 0 (falsy).
        this.clothing = value;

        PubSub.publish(CLOTHING_ITEM, value);
    }
}

export default Inventory;
