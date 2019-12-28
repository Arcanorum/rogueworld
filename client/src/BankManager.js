
import ItemTypes from '../src/catalogues/ItemTypes'

class BankItem {
    constructor () {
        /**
         * The entry of this item in the ItemTypes catalogue. Null if this bank item slot is empty.
         * @type {Object||null}
         */
        this.catalogueEntry = null;
        this.durability = null;
        this.maxDurability = null;
    }
}

class BankManager {

    constructor (items) {
        //console.log("bank manager, items:", items);

        this.selectedTab = 1;

        // Add to the bank panel slot index to get the slot index relative to the selected tab.
        this.selectedTabSlotIndexOffset = 0;

        /** @type {BankItem[]} */
        this.items = [];

        // Add the slots.
        for(let i=0; i<60; i+=1){
            this.items.push(new BankItem());
        }

        // If a list of existing items on this player was given, fill the client inventory.
        if(items !== undefined){
            let item = {};
            for(let i=0, len=items.length; i<len; i+=1){
                item = items[i];
                // Set the properties here. The GUI will handle showing them when it is created.
                this.items[item.slotIndex].catalogueEntry = ItemTypes[item.typeNumber];
                this.items[item.slotIndex].durability = item.durability;
                this.items[item.slotIndex].maxDurability = item.maxDurability;
            }
        }
    }

    /**
     * Searches through the bank items list to find an empty slot.
     * If one is found, returns the index. Otherwise, returns false.
     * @returns {Number|Boolean}
     */
    getFirstEmptySlotIndex () {
        // Find the first empty slot.
        for(let i=0; i<this.items.length; i+=1){
            // If an empty slot is found, return it.
            if(this.items[i].catalogueEntry === null) return i;
        }
        // No empty slot found.
        return false;
    }

    /**
     * Searches through the bank items list to find an empty slot in the current selected tab.
     * If one is found, returns the index. Otherwise, returns false.
     * @returns {Number|Boolean}
     */
    getFirstEmptySlotIndexInSelectedTab () {
        const selectedTab = this.selectedTab;
        const startSlotIndex = (selectedTab - 1) * 15;
        const endSlotIndex = startSlotIndex + 15;

        for(let i=startSlotIndex; i<endSlotIndex; i+=1){
            // If an empty slot is found, return it.
            if(this.items[i].catalogueEntry === null) return i;
        }
        // No empty slot found.
        return false;
    }

    /**
     * Get the bank tab that a bank slot index belongs to.
     * @param {Number|String} slotIndex 
     */
    slotIndexToTabNumber (slotIndex) {
        if(slotIndex < 15) return 1;
        if(slotIndex < 30) return 2;
        if(slotIndex < 45) return 3;
        return 4;
    }

    depositItem (inventorySlotKey, bankSlotIndex) {
        window.ws.sendEvent('bank_deposit_item', {inventorySlotKey: inventorySlotKey, bankSlotIndex: bankSlotIndex});
    }

    withdrawItem (bankSlotIndex, inventorySlotKey) {
        //console.log("bank withdraw item, slotindex:", bankSlotIndex);
        window.ws.sendEvent('bank_withdraw_item', {bankSlotIndex: bankSlotIndex, inventorySlotKey: inventorySlotKey});
    }

    /**
     *
     * @param {Number} slotIndex
     * @param {{}|null} catalogueEntry - A reference to the catalogue entry for this type of item. Null if there is nothing in this slot.
     * @param {Number|null} durability
     * @param {Number|null} maxDurability
     */
    addItemToContents (slotIndex, catalogueEntry, durability, maxDurability) {
        //console.log("add item to bank contents:", slotIndex);
        const slot = this.items[slotIndex];
        if(slot === undefined) return;

        slot.catalogueEntry = catalogueEntry;
        slot.durability = durability;
        slot.maxDurability = maxDurability;

        // If the target slot index is within the current tab, update the GUI slot.
        if(this.slotIndexToTabNumber(slotIndex) === this.selectedTab){
            const guiSlot = _this.GUI.bankPanel.slots[slotIndex - this.selectedTabSlotIndexOffset];

            // Change the source image for the icon.
            guiSlot.icon.src = "assets/img/gui/items/" + catalogueEntry.iconSource + ".png";
            guiSlot.icon.style.visibility = "visible";

            // Make the background look occupied.
            guiSlot.refreshBackground();

            if(durability !== null){
                guiSlot.durability.style.visibility = "visible";
                // Get the durability of the item as a proportion of the max durability, to use as the meter source image.
                const meterNumber = Math.floor((durability / maxDurability) * 10);
                guiSlot.durability.src = "assets/img/gui/hud/durability-meter-" + meterNumber + ".png";
            }
            else {
                guiSlot.durability.style.visibility = "hidden";
            }
        }

    }

    /**
     * Empties the bank slot that the item was withdrawn from.
     * @param {Number} slotIndex - The index of the slot to empty.
     */
    removeItemFromContents (slotIndex) {
        //console.log("remove item from contents:", slotIndex);
        const slot = this.items[slotIndex];
        if(slot === undefined) return;

        slot.catalogueEntry = null;
        slot.durability = null;
        slot.maxDurability = null;

        // If the target slot index is within the current tab, update the GUI slot.
        if(this.slotIndexToTabNumber(slotIndex) === this.selectedTab){
            const guiSlot = _this.GUI.bankPanel.slots[slotIndex - this.selectedTabSlotIndexOffset];
            guiSlot.icon.style.visibility = "hidden";
            guiSlot.durability.style.visibility = "hidden";

            // Make the background look empty.
            guiSlot.refreshBackground();
        }
    }

    swapSlots (fromIndex, toIndex) {
        //console.log("swapping bank slots:", fromIndex, "to", toIndex);

        // Make sure they are numbers, not strings.
        fromIndex *= 1;
        toIndex *= 1;

        const GUIslots = _this.GUI.bankPanel.slots;

        /** @type {BankItem} */
        const fromItem = this.items[fromIndex + this.selectedTabSlotIndexOffset];
        // Temporary store of the data of the item being moved.
        const fromSlotData = {
            catalogueEntry: fromItem.catalogueEntry,
            durability: fromItem.durability,
            maxDurability: fromItem.maxDurability,
            iconSource: GUIslots[fromIndex].icon.src
        };

        /** @type {BankItem} */
        const toItem = this.items[toIndex + this.selectedTabSlotIndexOffset];

        // Update the item data of the item being move to be the same as what it is moved into.
        fromItem.catalogueEntry = toItem.catalogueEntry;
        fromItem.durability = toItem.durability;
        fromItem.maxDurability = toItem.maxDurability;

        //console.log("gui slots:", GUIslots);
        //console.log("from item:", fromItem);

        // The item data from the TO slot has been moved into the item data for the FROM slot. Now update the GUI for the FROM slot.
        // Check if any item was moved to this slot. Might have swapped with an empty slot.
        if(fromItem.catalogueEntry === null){
            // Hide the icon and durability bar.
            GUIslots[fromIndex].icon.style.visibility = "hidden";
            GUIslots[fromIndex].durability.style.visibility = "hidden";
        }
        else {
            // Item was moved. Show the icon, and also show the durability bar if it has a durability.
            GUIslots[fromIndex].icon.style.visibility = "visible";
            GUIslots[fromIndex].icon.src = GUIslots[toIndex].icon.src;
            if(fromItem.durability === null){
                GUIslots[fromIndex].durability.style.visibility = "hidden";
            }
            else {
                GUIslots[fromIndex].durability.style.visibility = "visible";
                // Get the durability of the item as a proportion of the max durability, to use as the meter source image.
                const meterNumber = Math.floor((fromItem.durability / fromItem.maxDurability) * 10);
                GUIslots[fromIndex].durability.src = "assets/img/gui/hud/durability-meter-" + meterNumber + ".png";
            }
        }

        // The FROM slot is done. Now update the data stored in the TO item to be what was in the FROM item.
        toItem.catalogueEntry = fromSlotData.catalogueEntry;
        toItem.durability = fromSlotData.durability;
        toItem.maxDurability = fromSlotData.maxDurability;

        // Update the TO slot to show what was moved into it.
        if(toItem.catalogueEntry === null){
            // Hide the icon and durability bar.
            GUIslots[toIndex].icon.style.visibility = "hidden";
            GUIslots[toIndex].durability.style.visibility = "hidden";
        }
        else {
            // Item was moved. Show the icon, and also show the durability bar if it has a durability.
            GUIslots[toIndex].icon.style.visibility = "visible";
            GUIslots[toIndex].icon.src = fromSlotData.iconSource;
            if(toItem.durability === null){
                GUIslots[toIndex].durability.style.visibility = "hidden";
            }
            else {
                GUIslots[toIndex].durability.style.visibility = "visible";
                // Get the durability of the item as a proportion of the max durability, to use as the meter source image.
                const meterNumber = Math.floor((toItem.durability / toItem.maxDurability) * 10);
                GUIslots[toIndex].durability.src = "assets/img/gui/hud/durability-meter-" + meterNumber + ".png";
            }
        }

        window.ws.sendEvent("bank_swap_slots", {fromSlotIndex: fromIndex + this.selectedTabSlotIndexOffset, toSlotIndex: toIndex + this.selectedTabSlotIndexOffset});
    }

    setSelectedTab (tabNumber) {
        // Make sure it is a number, and not a string. 1, not "1".
        this.selectedTab = 1*tabNumber;
        this.selectedTabSlotIndexOffset = (1*tabNumber - 1) * 15;
    }

    loadTab (tabNumber) {
        this.setSelectedTab(tabNumber);
        // Works good enough.
        _this.GUI.bankPanel.hide();
        _this.GUI.bankPanel.show();
    }
}

export default BankManager;