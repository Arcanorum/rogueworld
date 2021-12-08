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

        // Need this to map the hotbar slot to invetory slot Index
        this.keyToSlotIndex = {};

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
        this.removeFromHotbar(item, true);
    }

    removeAllFromInventory() {
        this.items.forEach((item) => {
            // Remove it from the hotbar if it was on it.
            this.removeFromHotbar(item, true);
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
        this.keyToSlotIndex[this.hotbar.length - 1] = itemConfig.slotIndex;
        PubSub.publish(HOTBAR_ITEM);
        PubSub.publish(MODIFY_INVENTORY_ITEM);
        if (this.saveSession === true) {
            this.saveHotbar();
        }
    }

    resetMapping() {
        Utils.warning("This is a bug found or a localStorage mismatch");
        this.keyToSlotIndex = {};
        this.saveHotbar();
        this.hotbar = [];
        this.defaultHotBar();
    }

    updateSlotIndex(slotIndex) {
        // This function updates the mapping for when dropping an invetory item not found in hashmap
        Object.keys(this.keyToSlotIndex).forEach((key, index) => {
            if (this.keyToSlotIndex[key] >= slotIndex) {
                const updateValue = this.keyToSlotIndex[key] - 1;
                if (updateValue >= 0) {
                    this.keyToSlotIndex[key] = updateValue;
                    if (this.saveSession === true) {
                        this.saveHotbar();
                    }
                }
            }
        });
    }

    updateMapHotBarKeys(evictKey) {
        // This function updates the mapping for removing an item from our hotbar
        Object.keys(this.keyToSlotIndex).forEach((key, index) => {
            if (key >= evictKey) {
                const updateKey = key - 1;
                if (updateKey >= 0) {
                    this.keyToSlotIndex[updateKey] = this.keyToSlotIndex[key];
                    delete this.keyToSlotIndex[key];
                }
            }
        });
    }

    updateMapSlotIndex(evictValue) {
        // This function updates the mapping when item is removed from inventory
        Object.keys(this.keyToSlotIndex).forEach((key, index) => {
            if (this.keyToSlotIndex[key] >= evictValue) {
                const newValue = this.keyToSlotIndex[key] - 1;
                if (newValue >= 0) {
                    this.keyToSlotIndex[key] = newValue;
                }
            }
        });
    }

    removeFromHotbar(itemConfig, removedInventory = false) {
        const getKeys = Object.keys(this.keyToSlotIndex);
        const evictKey = getKeys.find((key) => this.keyToSlotIndex[key] === itemConfig.slotIndex);
        const evictValue = this.keyToSlotIndex[evictKey];

        // Case A: Item not found in the hashmap
        if (typeof evictKey === "undefined") {
            this.updateSlotIndex(itemConfig.slotIndex);
            return;
        }
        // Item is found in hashmap so we delete the entry
        delete this.keyToSlotIndex[evictKey];

        // Update the hotbar
        this.updateMapHotBarKeys(evictKey);

        // Item is removed from inventory so update the mapping
        if (removedInventory === true) {
            this.updateMapSlotIndex(evictValue);
        }
        this.hotbar = this.hotbar.filter((eachItem) => eachItem !== itemConfig);

        PubSub.publish(HOTBAR_ITEM);
        PubSub.publish(MODIFY_INVENTORY_ITEM);
        if (this.saveSession === true) {
            this.saveHotbar();
        }
    }

    saveHotbar() {
        window.localStorage.setItem(this.loadHotBarRequest, JSON.stringify(this.keyToSlotIndex));
    }

    defaultHotBar() {
        this.items.forEach((itemConfig) => {
            this.addToHotbar(itemConfig);
        });
    }

    initializeHotbar() {
        // Allocate memory in our array size of hashmap so we can access the elements without seg fault
        const saveDataSize = Object.keys(this.keyToSlotIndex).length;
        this.items.forEach((itemConfig) => {
            if (this.hotbar.length >= saveDataSize) {
                return;
            }
            this.hotbar.push(itemConfig);
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
        this.keyToSlotIndex = JSON.parse(loadStorageHotbar);
        if (Object.keys(this.keyToSlotIndex).length === 0) {
            this.defaultHotBar();
            return;
        }
        const mapToArray = Object.values(this.keyToSlotIndex)
            .sort((order1, order2) => order1 - order2);

        const checkDup = mapToArray.filter((item, index) => mapToArray.indexOf(item) !== index);
        // Found duplicate enteries, bug is found
        if (checkDup.length !== 0) {
            Utils.warning("Duplicate entries detected");
            this.resetMapping();
            return;
        }
        this.initializeHotbar();
        this.populateInvetorytoHotbar();
    }

    populateInvetorytoHotbar() {
        Object.keys(this.keyToSlotIndex).forEach((key, value) => {
            if (key < 0 || this.keyToSlotIndex[key] < 0) {
                Utils.warning("Negative Indexes are detected", this.keyToSlotIndex);
                this.resetMapping();
            }
            else if (key >= this.hotbar.length || this.keyToSlotIndex[key] >= this.items.length) {
                Utils.warning("Index exceeded length of hotbar", this.keyToSlotIndex);
                this.resetMapping();
            } else if (this.items[this.keyToSlotIndex[key]].typeCode.hasUseEffect) {
                Utils.warning("Reading Incorrect Index", this.keyToSlotIndex);
                this.resetMapping();
            } else if (Object.keys(this.keyToSlotIndex).length !== 0) {
                this.hotbar[key] = this.items[this.keyToSlotIndex[key]];
                PubSub.publish(HOTBAR_ITEM);
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
