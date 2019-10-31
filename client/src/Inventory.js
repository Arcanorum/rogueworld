import InventorySlot from "./InventorySlot";
import ItemTypes from '../src/catalogues/ItemTypes'

class Inventory {

    constructor (inventory) {
        this.slot1 = new InventorySlot("slot1");
        this.slot2 = new InventorySlot("slot2");
        this.slot3 = new InventorySlot("slot3");
        this.slot4 = new InventorySlot("slot4");
        this.slot5 = new InventorySlot("slot5");
        this.slot6 = new InventorySlot("slot6");
        this.slot7 = new InventorySlot("slot7");
        this.slot8 = new InventorySlot("slot8");
        this.slot9 = new InventorySlot("slot9");
        this.slot0 = new InventorySlot("slot0");

        // If a list of existing items on this player was given, fill the client inventory.
        if(inventory !== undefined){
            let item = {};
            for(let i=0, len=inventory.length; i<len; i+=1){
                item = inventory[i];
                // Set the properties here. The GUI will handle showing them when it is created.
                this[item.slotKey].catalogueEntry = ItemTypes[item.typeNumber];
                this[item.slotKey].durability = item.durability;
                this[item.slotKey].maxDurability = item.maxDurability;
            }
        }
    }

    useHeldItem (direction) {
        if(direction === undefined){
            // Tell the game server this player wants to use this item.
            ws.sendEvent('use_held_item');
        }
        else {
            // Tell the game server this player wants to use this item in a direction.
            ws.sendEvent('use_held_item', direction);
        }
    }

    useItem (slotNumber) {
        // Check there is an item in that inventory slot.
        if(this[slotNumber].catalogueEntry === null){
            return;
        }

        // Check if they want to drop the item.
        if(_this.keyboardKeys.shift.isDown === true){
            // Tell the game server this player wants to drop this item.
            window.ws.sendEvent('drop_item', slotNumber);
            return;
        }

        // Tell the game server this player wants to use this item.
        window.ws.sendEvent('use_item', slotNumber);
    }

    swapInventorySlots(slotKeyFrom, slotKeyTo){
        //console.log("swapping inventory slots: from", slotKeyFrom, "to", slotKeyTo);

        const GUIslots = _this.GUI.inventoryBar.slots;
        const fromSlot = this[slotKeyFrom];
        const fromSlotData = {
            catalogueEntry: fromSlot.catalogueEntry,
            craftingComponent: fromSlot.craftingComponent,
            durability: fromSlot.durability,
            maxDurability: fromSlot.maxDurability,
            equippedSource: GUIslots[fromSlot.slotKey].equipped.src,
            equippedVisibility: GUIslots[fromSlot.slotKey].equipped.style.visibility
        };
        const toSlot = this[slotKeyTo];
        const toSlotData = {
            catalogueEntry: toSlot.catalogueEntry,
            craftingComponent: toSlot.craftingComponent,
            durability: toSlot.durability,
            maxDurability: toSlot.maxDurability,
            equippedSource: GUIslots[toSlot.slotKey].equipped.src,
            equippedVisibility: GUIslots[toSlot.slotKey].equipped.style.visibility
        };

        this[slotKeyFrom].empty();
        this[slotKeyTo].empty();

        this[slotKeyFrom].fill(toSlotData.catalogueEntry, toSlotData.durability, toSlotData.maxDurability);
        this[slotKeyTo].fill(fromSlotData.catalogueEntry, fromSlotData.durability, fromSlotData.maxDurability);

        // When the slots were emptied, the equipped icon was hidden. Reshow it for items that were equipped.
        if(fromSlotData.equippedVisibility === "visible"){
            GUIslots[slotKeyTo].equipped.style.visibility = "visible";
            GUIslots[slotKeyTo].equipped.src = fromSlotData.equippedSource;
        }
        if(toSlotData.equippedVisibility === "visible"){
            GUIslots[slotKeyFrom].equipped.style.visibility = "visible";
            GUIslots[slotKeyFrom].equipped.src = toSlotData.equippedSource;
        }

        window.ws.sendEvent('swap_inventory_slots', {slotKeyFrom: slotKeyFrom, slotKeyTo: slotKeyTo});

    }

}

export default Inventory;