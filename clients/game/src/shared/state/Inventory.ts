import { warning } from '@rogueworld/utils';
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
import ItemState from '../ItemState';
import Config from '../Config';

class Inventory {
    items!: Array<ItemState>;

    /**
     * A separate list of items for the hotbar, as things can be rearranged, so just using the
     * slotIndex from the items won't be enough.
     */
    hotbar!: Array<ItemState>;

    MAX_HOTBAR_SLOTS!: 8;

    holding!: ItemState | null;

    clothing!: ItemState | null;

    ammunition!: ItemState | null;

    weight!: number;

    maxWeight!: number;

    /**
     * Whether usable items will be automatically added to the hotbar when picked up if there is a
     * free hotbar slot.
     */
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

    setItems(itemStates: Array<ItemState>) {
        this.items = itemStates;
    }

    addToInventory(itemState: ItemState) {
        this.items.push(itemState);

        PubSub.publish(ADD_INVENTORY_ITEM, itemState);

        // Only add automatically if the setting for it is set.
        if (this.autoAddToHotbar) {
            this.addToHotbar(itemState);
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

    addToHotbar(itemState: ItemState) {
        // Don't add to the hotbar if there is no available space on it.
        if (this.hotbar.length >= this.MAX_HOTBAR_SLOTS) return;

        // Only add if it is usable.
        if (!Config.ItemTypes[itemState.typeCode].hasUseEffect) return;

        this.hotbar.push(itemState);
        PubSub.publish(HOTBAR_ITEM);
        PubSub.publish(MODIFY_INVENTORY_ITEM);
        if (this.userAccountId !== null) {
            this.saveHotbar();
        }
    }

    removeFromHotbar(itemState: ItemState) {
        this.hotbar = this.hotbar.filter((eachItem) => eachItem !== itemState);
        PubSub.publish(HOTBAR_ITEM);
        PubSub.publish(MODIFY_INVENTORY_ITEM);
        if (this.userAccountId !== null) {
            this.saveHotbar();
        }
    }

    getHotbarItemIds() {
        // Generate an array of strings from the item ids.
        return this.hotbar.map((itemState) => itemState.id);
    }

    saveHotbar() {
        const hotbarItemIds = this.getHotbarItemIds();
        window.localStorage.setItem(this.loadHotBarRequest, JSON.stringify(hotbarItemIds));
    }

    defaultHotBar() {
        this.items.forEach((itemState) => {
            this.addToHotbar(itemState);
        });
    }

    loadHotbar(accountId: string) {
        this.userAccountId = accountId;
        this.loadHotBarRequest = `${this.userAccountId}_hotbar`;
        const loadStorageHotbar = window.localStorage.getItem(this.loadHotBarRequest);
        // If the session does not exist or user is not logged in
        if (!this.userAccountId || !loadStorageHotbar) {
            this.defaultHotBar();
            return;
        }
        this.populateInventoryToHotbar(JSON.parse(loadStorageHotbar));
    }

    populateInventoryToHotbar(savedHotbarItemIds: Array<string>) {
        savedHotbarItemIds.forEach((savedItemId) => {
            this.items.forEach((itemState) => {
                if (savedItemId === itemState.id) {
                    this.addToHotbar(itemState);
                }
            });
        });
    }

    modifyItem(itemState: {
        slotIndex: number;
        quantity: number;
        totalWeight: number;
    }) {
        const item = this.items[itemState.slotIndex];

        if (!item) {
            warning('Cannot modify item in inventory. Invalid slot index given. Config:', itemState);
            return;
        }

        const oldItemState = {
            slotIndex: item.slotIndex,
            quantity: item.quantity,
            totalWeight: item.totalWeight,
        };

        if (itemState.quantity) {
            item.quantity = itemState.quantity;
            item.totalWeight = itemState.totalWeight;
        }
        else {
            warning('Cannot modify item in inventory. No quantity given. Config:', itemState);
        }

        PubSub.publish(MODIFY_INVENTORY_ITEM, { new: itemState, old: oldItemState });
    }

    setWeight(value: number) {
        this.weight = value;

        PubSub.publish(MODIFY_INVENTORY_WEIGHT, { new: value });
    }

    setMaxWeight(value: number) {
        this.maxWeight = value;
    }

    setHolding(value: ItemState | null) {
        // Allow slot index of 0 (falsy).
        this.holding = value;

        PubSub.publish(HOLDING_ITEM, value);
    }

    setAmmunition(value: ItemState | null) {
        // Allow slot index of 0 (falsy).
        this.ammunition = value;

        PubSub.publish(AMMUNITION_ITEM, value);
    }

    setClothing(value: ItemState | null) {
        // Allow slot index of 0 (falsy).
        this.clothing = value;

        PubSub.publish(CLOTHING_ITEM, value);
    }
}

export default Inventory;
