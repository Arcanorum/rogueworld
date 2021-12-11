import PubSub from "pubsub-js";
import ItemTypes from "../../catalogues/ItemTypes.json";
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
} from "../EventTypes";
import gameConfig from "../GameConfig";
import Utils from "../Utils";

class Inventory {
    constructor() {
        this.init();
    }

    init() {
        this.items = [];

        // Need to keep a separate list for the hotbar as things can be rearranged.
        this.hotbar = [];

        this.saveItemId = {};

        this.MAX_HOTBAR_SLOTS = 8;

        this.holding = null;

        this.clothing = null;

        this.ammunition = null;

        this.weight = 0;

        this.maxWeight = 0;

        /**
         * Whether usable items will be automatically added to the hotbar when picked up if there is a free hotbar slot.
         * @type {Boolean}
         */
        this.autoAddToHotbar = true;

        this.saveSession = false;

        this.userName = "";

        this.loadHotBarRequest = "";

        this.foundKey = false;
    }

    setItems(itemConfigs) {
        this.items = itemConfigs;
    }

    addToInventory(itemConfig) {
        this.items.push(itemConfig);

        PubSub.publish(ADD_INVENTORY_ITEM, itemConfig);

        // Only add automatically if the setting for it is set.
        if (this.autoAddToHotbar) {
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

    addToHotbar(itemConfig) {
        // Don't add to the hotbar if there is no available space on it.
        if (this.hotbar.length >= this.MAX_HOTBAR_SLOTS) return;

        // Only add if it is usable.
        if (!ItemTypes[itemConfig.typeCode].hasUseEffect) return;

        this.hotbar.push(itemConfig);
        this.saveItemId[itemConfig.id] = itemConfig.slotIndex;
        PubSub.publish(HOTBAR_ITEM);
        PubSub.publish(MODIFY_INVENTORY_ITEM);
        if (this.saveSession === true) {
            this.saveHotbar();
        }
    }

    removeFromHotbar(itemConfig) {
        delete this.saveItemId[itemConfig.id];
        this.hotbar = this.hotbar.filter((eachItem) => eachItem !== itemConfig);
        PubSub.publish(HOTBAR_ITEM);
        PubSub.publish(MODIFY_INVENTORY_ITEM);
        if (this.saveSession === true) {
            this.saveHotbar();
        }
    }

    saveHotbar() {
        window.localStorage.setItem(this.loadHotBarRequest, JSON.stringify(this.saveItemId));
    }

    defaultHotBar() {
        this.items.forEach((itemConfig) => {
            this.addToHotbar(itemConfig);
        });
    }

    loadFromLocalStorage(playerID) {
        this.saveSession = true;
        this.userName = playerID;
        const gameName = "dungeonz";
        const requestHotbar = "hotBar";
        this.loadHotBarRequest = gameName + this.userName + requestHotbar;
    }

    loadHotbar(playerID, isLoggedIn) {
        if (isLoggedIn === true) {
            this.loadFromLocalStorage(playerID);
        }
        const loadStorageHotbar = window.localStorage.getItem(this.loadHotBarRequest);
        if (this.saveSession === false || loadStorageHotbar === null) {
            this.defaultHotBar();
            return;
        }
        this.saveItemId = JSON.parse(loadStorageHotbar);
        this.populateInvetorytoHotbar();
    }

    populateInvetorytoHotbar() {
        Object.keys(this.saveItemId).forEach((key, value) => {
            this.items.forEach((itemConfig) => {
                if (key === itemConfig.id) {
                    this.addToHotbar(itemConfig);
                }
            });
        });

        // For the case there is a mismatch in session remove non-existing keys
        Object.keys(this.saveItemId).forEach((key, value) => {
            this.foundKey = false;
            this.hotbar.forEach((itemConfig) => {
                if (itemConfig.id === key) {
                    this.foundKey = true;
                }
            });
            if (this.foundKey === false) {
                delete this.saveItemId[key];
            }
        });
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

        PubSub.publish(MODIFY_INVENTORY_ITEM, { new: itemConfig });
    }

    setWeight(value) {
        this.weight = value;

        PubSub.publish(MODIFY_INVENTORY_WEIGHT, { new: value });
    }

    setMaxWeight(value) {
        this.maxWeight = value;
    }

    setHolding(value) {
        // Allow slot index of 0 (falsy).
        this.holding = (value || value === 0) || null;

        PubSub.publish(HOLDING_ITEM, value);
    }

    setAmmunition(value) {
        // Allow slot index of 0 (falsy).
        this.ammunition = (value || value === 0) || null;

        PubSub.publish(AMMUNITION_ITEM, value);
    }

    setClothing(value) {
        // Allow slot index of 0 (falsy).
        this.clothing = (value || value === 0) || null;

        PubSub.publish(CLOTHING_ITEM, value);
    }
}

export default Inventory;
