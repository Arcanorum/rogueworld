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

        this.updateIndex = 0;
        /**
         * Whether usable items will be automatically added to the hotbar when picked up if there is a free hotbar slot.
         * @type {Boolean}
         */
        this.SaveSession = false;

        this.userName = "";
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
        // Utils.message(itemConfig.slotIndex);
        this.mapKey[this.hotbar.length - 1] = itemConfig.slotIndex;
        PubSub.publish(HOTBAR_ITEM);
        PubSub.publish(MODIFY_INVENTORY_ITEM);
        if (this.SaveSession === true) {
            this.saveLocalHotbar();
        }
    }

    // updateMappingInvetory(itemConfig) {
    //     Utils.message("Updating mapping values starting from FLAG A:", this.updateIndex);
    //     Object.keys(this.mapKey).forEach((key, index) => {
    //         if (key >= this.updateIndex) {
    //             Utils.message(this.mapKey[key]);
    //             const newkey = this.mapKey[key] - 1;
    //             if (newkey >= 0) {
    //                 this.mapKey[key] = newkey;
    //                 Utils.message("CHECKING THESE VALUES: ", this.mapKey);
    //                 // delete this.mapKey[key];
    //             }
    //         }
    //     });
    // }

    resetMapping() {
        Utils.warning("This is a bug found or a localStorage mismatch");
        Utils.message("BRUHHH CODEE PROPERLY!!!!!!!!!");
        this.mapKey = {};
        this.saveLocalHotbar();
        this.hotbar = [];
        this.defaultHotBar();
    }

    removeFromHotbar(itemConfig, removedInventory = false) {
        const a = Object.keys(this.mapKey).find((key) => this.mapKey[key] === itemConfig.slotIndex);
        if (typeof a === "undefined") {
            const b = itemConfig.slotIndex;
            Object.keys(this.mapKey).forEach((key, index) => {
                if (this.mapKey[key] >= b) {
                    Utils.message("Missing IDs", b, key);
                    const newkeyA = this.mapKey[key] - 1;
                    if (newkeyA >= 0) {
                        this.mapKey[key] = newkeyA;
                        Utils.message("CHECKING THESE VALUES: ", this.mapKey);
                        if (this.SaveSession === true) {
                            this.saveLocalHotbar();
                        }
                    }
                }
            });
            return;
        }
        // this.updateIndex = a;
        Utils.message("Updating mapping values starting from FLAG B:", a, removedInventory);
        delete this.mapKey[a];
        // Utils.message(parseInt(a, 10) === Object.keys(this.mapKey).length - 1);
        Object.keys(this.mapKey).forEach((key, index) => {
            if (key >= a) {
                const originalKey = key;
                Utils.message(originalKey);
                const newkey = key - 1;
                if (newkey >= 0) {
                    this.mapKey[newkey] = this.mapKey[key];
                    delete this.mapKey[key];
                }
                if (removedInventory) {
                    if (newkey >= a) {
                        Utils.message(this.mapKey[newkey]);
                        const newkeyA = this.mapKey[newkey] - 1;
                        if (newkeyA >= 0) {
                            Utils.message("LETS GOOO :)", newkeyA);
                            this.mapKey[newkey] = newkeyA;
                            Utils.message("CHECKING THESE VALUES: ", this.mapKey);
                            // delete this.mapKey[key];
                        }
                    }
                }
            }
        });
        // window.localStorage.setItem("hotbarIDs", JSON.stringify(this.hotbar[key].id));
        // const space = " ";
        // this.idhotbar.add(String(this.hotbar[key].typeCode) + space + String(index));
        // Utils.message(this.hotbar[key].id);
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
        if (this.SaveSession === true) {
            this.saveLocalHotbar();
        }
    }

    saveLocalHotbar() {
        Utils.message("Saving Data to local Storage:");
        // const item = this.hotbar[id];
        // window.localStorage.clear();
        const sessionIDMap = "Mapping";
        window.localStorage.removeItem(this.userName + sessionIDMap);
        window.localStorage.setItem(this.userName + sessionIDMap, JSON.stringify(this.mapKey));

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

    printHotBar() {
        Utils.message("Unique IDs for each item in invetory");
        Object.keys(this.items).forEach((key) => {
            // window.localStorage.setItem("hotbarIDs", JSON.stringify(this.hotbar[key].id));
            Utils.message(this.items[key].id);
            // this.idhotbar.add(this.hotbar[key].id);
            // Utils.message(this.hotbar[key].id);
        });
        Utils.message("Done reading IDs for each item in inventory");
    }

    defaultHotBar() {
        this.items.forEach((itemConfig) => {
            this.addToHotbar(itemConfig);
        });
    }

    LoadHotBar() {
        const saveDataSize = Object.keys(this.mapKey).length;
        Utils.message("Population intiali load bar with this size: ");
        Utils.message(saveDataSize);
        this.items.forEach((itemConfig) => {
            if (this.hotbar.length >= saveDataSize) {
                return;
            }
            this.hotbar.push(itemConfig);
        });
        Utils.message("Size of bar", this.hotbar.length);
    }

    loadLocalHotbar(playerID, isLoggedIn) {
        if (isLoggedIn === true) {
            // Utils.message("FLAG 10");
            this.SaveSession = true;
        }
        this.userName = playerID;
        const a = "User Name: ";
        const b = "User Logged in: ";
        Utils.message(a + playerID, b + isLoggedIn);
        // window.localStorage.clear();
        this.printHotBar();
        const sessionIDMap = "Mapping";
        // window.localStorage.clear();
        if (this.SaveSession === false
        || window.localStorage.getItem(this.userName + sessionIDMap) === null) {
            Utils.message("CAME HERE VALUE  = ", window.localStorage.getItem(this.userName + sessionIDMap));
            this.defaultHotBar();
            return;
        }
        Utils.message("Loading Data from local Storage: Flag 1");
        const storedMapping = window.localStorage.getItem(this.userName + sessionIDMap);
        this.mapKey = JSON.parse(storedMapping);
        Utils.message("CHECKIGN THESE VALEUS: ");
        Utils.message(this.mapKey, Object.keys(this.mapKey).length);
        Utils.message("DONE CHECKING: ");
        if (Object.keys(this.mapKey).length === 0) {
            this.items.forEach((itemConfig) => {
                this.addToHotbar(itemConfig);
            });
            return;
        }
        Utils.message(this.mapKey);
        const orders = Object.values(this.mapKey)
            .sort((order1, order2) => order1 - order2);
        const findDup = orders.filter((item, index) => orders.indexOf(item) !== index);
        // Utils.message(findDup);
        // Checks for duplication as a result of currupt data
        if (findDup.length !== 0) {
            this.resetMapping();
            return;
        }
        // Utils.message(orders);
        // if ((this.mapKey.values.length) !== new Set(this.mapKey.value).length) {
        //     this.resetMapping();
        //     return;
        // }
        this.LoadHotBar();
        // this.items.forEach((itemConfig) => {
        //     Utils.message("Loading Data from local Storage: Flag 2");
        //     if (this.idhotbar.has(itemConfig.typeCode)) {
        //         Utils.message("Loading Data from local Storage: Flag 4");
        //         if (this.hotbar.length < this.MAX_HOTBAR_SLOTS
        //             && this.hotbar.length <= Object.keys(this.mapKey).length) {
        //             this.hotbar.push(itemConfig);
        //         }
        //         // this.addToHotbar(itemConfig);
        //     }
        //     // this.addToHotbar(itemConfig);
        // });
        Object.keys(this.mapKey).forEach((key, value) => {
            Utils.message(key, this.mapKey[key]);
            if (key < 0 || this.mapKey[key] < 0) {
                Utils.warning("Min underflow");
                this.resetMapping();
                Utils.message(this.mapKey);
                // return;
            }
            else if (key >= this.hotbar.length || this.mapKey[key] >= this.items.length) {
                Utils.warning("Max overflow");
                this.resetMapping();
                // return;
            } else if (this.items[this.mapKey[key]].typeCode.hasUseEffect) {
                // Utils.warning("HERE WTF");
                this.resetMapping();
            } else if (Object.keys(this.mapKey).length !== 0) {
                // Utils.message("NO WAY!");
                this.hotbar[key] = this.items[this.mapKey[key]];
                PubSub.publish(HOTBAR_ITEM);
                PubSub.publish(MODIFY_INVENTORY_ITEM);
            }
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
