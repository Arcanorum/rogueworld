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

        this.idhotbar = new Set();

        this.mapKey = {};

        // Need to keep a separate list for the hotbar as things can be rearranged.
        this.hotbar = [];

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
    }

    setItems(itemConfigs) {
        this.items = itemConfigs;
    }

    addToInventory(itemConfig) {
        this.items.push(itemConfig);

        PubSub.publish(ADD_INVENTORY_ITEM, itemConfig);

        // Only add automatically if the setting for it is set.
        // if (this.autoAddToHotbar) {
        //     this.addToHotbar(itemConfig);
        // }
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
        // Utils.message(itemConfig.slotIndex);
        this.mapKey[this.hotbar.length - 1] = itemConfig.slotIndex;
        PubSub.publish(HOTBAR_ITEM);
        PubSub.publish(MODIFY_INVENTORY_ITEM);
        this.saveLocalHotbar();
    }

    removeFromHotbar(itemConfig) {
        const a = Object.keys(this.mapKey).find((key) => this.mapKey[key] === itemConfig.slotIndex);
        delete this.mapKey[itemConfig.slotIndex];
        Object.keys(this.mapKey).forEach((key, index) => {
            if (key >= a) {
                Utils.message(key);
                const newkey = key - 1;
                if (newkey >= 0) {
                    this.mapKey[newkey] = this.mapKey[key];
                    delete this.mapKey[key];
                }
            }
            // window.localStorage.setItem("hotbarIDs", JSON.stringify(this.hotbar[key].id));
            // const space = " ";
            // this.idhotbar.add(String(this.hotbar[key].typeCode) + space + String(index));
            // Utils.message(this.hotbar[key].id);
        });
        this.hotbar = this.hotbar.filter((eachItem) => eachItem !== itemConfig);
        // Object.keys(this.hotbar).forEach((key, index) => {
        //     this.mapKey[index]
        //     // Utils.message(index);
        //     // window.localStorage.setItem("hotbarIDs", JSON.stringify(this.hotbar[key].id));
        //     // const space = " ";
        //     this.idhotbar.add(this.hotbar[key].typeCode);
        //     // Utils.message(this.hotbar[key].id);
        // });
        PubSub.publish(HOTBAR_ITEM);
        PubSub.publish(MODIFY_INVENTORY_ITEM);
        this.saveLocalHotbar();
    }

    saveLocalHotbar() {
        Utils.message("Saving Data to local Storage:");
        // const item = this.hotbar[id];
        this.idhotbar = new Set();
        // this.idhotbar = [];
        Object.keys(this.hotbar).forEach((key, index) => {
            // Utils.message(index);
            // window.localStorage.setItem("hotbarIDs", JSON.stringify(this.hotbar[key].id));
            // const space = " ";
            this.idhotbar.add(this.hotbar[key].typeCode);
            // Utils.message(this.hotbar[key].id);
        });
        // window.localStorage.clear();
        const convertoArray = Array.from(this.idhotbar);
        window.localStorage.clear();
        Utils.message(this.mapKey);
        window.localStorage.setItem("Mapping", JSON.stringify(this.mapKey));
        window.localStorage.setItem("hotbarIDs", JSON.stringify(convertoArray));
        this.idhotbar.clear();
        // // Utils.message("Loading Data from local Storage WITHIN: ");
        // const storedIds = window.localStorage.getItem("hotbarIDs");
        // const convertoArray2 = JSON.parse(storedIds);
        // Utils.message(convertoArray2);
        // convertoArray2.forEach((itemConfig) => {
        //     Utils.message(itemConfig);
        // });
        // this.loadLocalHotbar();
        // this.idhotbar = [];

        // this.loadLocalHotbar();
        // Utils.message(this.idhotbar);
        // window.localStorage.setItem("hotbarIDs", JSON.stringify(this.idhotbar));
    }

    // printHotBar() {
    //     Utils.message("Data from hotbar");
    //     Object.keys(this.items).forEach((key) => {
    //         // window.localStorage.setItem("hotbarIDs", JSON.stringify(this.hotbar[key].id));
    //         Utils.message(this.items[key].typeCode);
    //         // this.idhotbar.add(this.hotbar[key].id);
    //         // Utils.message(this.hotbar[key].id);
    //     });
    //     Utils.message("Done loading Data from hotbar");
    // }

    loadLocalHotbar() {
        // this.printHotBar();
        // If the local storage does not exist default it to the first two elements
        // window.localStorage.clear();
        if (window.localStorage.getItem("hotbarIDs") === null) {
            this.items.forEach((itemConfig) => {
                this.addToHotbar(itemConfig);
            });
            return;
        }
        this.idhotbar = new Set();
        Utils.message("Loading Data from local Storage: Flag 1");
        const storedIds = window.localStorage.getItem("hotbarIDs");
        const storedMapping = window.localStorage.getItem("Mapping");
        const convertoArray2 = JSON.parse(storedIds);
        const convertoArray3 = JSON.parse(storedMapping);
        this.mapKey = convertoArray3;
        Utils.message(convertoArray2, Object.keys(convertoArray3).length);
        convertoArray2.forEach((itemConfig) => {
            // const value = itemConfig.split(" ")[0];
            // const index = itemConfig.split(" ")[1];
            // Utils.message(value, index);
            this.idhotbar.add(itemConfig);
        });
        // this.idhotbar = JSON.parse(storedIds);
        Utils.message(this.mapKey);
        Utils.message(this.idhotbar, this.items);
        this.items.forEach((itemConfig) => {
            Utils.message("Loading Data from local Storage: Flag 2");
            if (this.idhotbar.has(itemConfig.typeCode)) {
                Utils.message("Loading Data from local Storage: Flag 4");
                if (this.hotbar.length < this.MAX_HOTBAR_SLOTS
                    && this.hotbar.length < Object.keys(convertoArray3).length) {
                    this.hotbar.push(itemConfig);
                }
                // this.addToHotbar(itemConfig);
            }
            // this.addToHotbar(itemConfig);
        });
        Object.keys(convertoArray3).forEach((key, value) => {
            Utils.message(key, convertoArray3[key]);
            this.hotbar[key] = this.items[convertoArray3[key]];
            PubSub.publish(HOTBAR_ITEM);
            PubSub.publish(MODIFY_INVENTORY_ITEM);
            // window.localStorage.setItem("hotbarIDs", JSON.stringify(this.hotbar[key].id));
            // const space = " ";
            // this.idhotbar.add(String(this.hotbar[key].typeCode) + space + String(index));
            // Utils.message(this.hotbar[key].id);
        });
        // convertoArray2.forEach((itemConfig) => {
        //     const value = itemConfig.split(" ")[0];
        //     const index = itemConfig.split(" ")[1];
        //     this.hotbar[index] = this.items
        //     Utils.message(value, index);
        //     this.idhotbar.add(itemConfig);
        // });
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
