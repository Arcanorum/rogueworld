
class InventorySlot {

    constructor (slotKey) {
        /**
         * A reference to the catalogue entry for this type of item. Null if there is nothing in this slot.
         * @type {{}|null}
         */
        this.catalogueEntry = null;

        /**
         * The component in the crafting panel that this item is being used in, otherwise null.
         * @type {Boolean}
         */
        this.craftingComponent = null;

        /**
         * How much durability this item has.
         * @type {Number|null}
         */
        this.durability = null;

        /**
         * How much durability this can have.
         * @type {Number|null}
         */
        this.maxDurability = null;

        this.slotKey = slotKey;
    }

    /**
     * Puts an item in this inventory slot.
     * @param {Object} catalogueEntry
     * @param {Number} durability
     * @param {Number} maxDurability
     */
    fill (catalogueEntry, durability, maxDurability) {
        if(catalogueEntry === null){
            this.empty();
            return;
        }
        // Add it to the client's inventory.
        this.catalogueEntry = catalogueEntry;
        this.durability = durability || null;
        this.maxDurability = maxDurability || null;

        /** @type {Slot} */
        const guiSlot = _this.GUI.inventoryBar.slots[this.slotKey];
        // Change the source image for the icon.
        guiSlot.icon.src = "assets/img/gui/items/" + catalogueEntry.iconSource + ".png";

        // Show the icon.
        guiSlot.icon.style.visibility = "visible";
        // And the add button if a panel that can be added to is open.
        guiSlot.refreshAddButton();

        // If there is a durability, show and fill the durability meter for this item.
        if(durability){
            guiSlot.durability.style.visibility = "visible";
            // Get the durability of the item as a proportion of the max durability, to use as the meter source image.
            const meterNumber = Math.floor((durability / maxDurability) * 10);
            guiSlot.durability.src = "assets/img/gui/hud//durability-meter-" + meterNumber + ".png";
        }
        else {
            guiSlot.durability.style.visibility = "hidden";
        }
    }

    empty () {
        // Hide the item icon and durability meter.
        _this.GUI.inventoryBar.slots[this.slotKey].icon.style.visibility = "hidden";
        _this.GUI.inventoryBar.slots[this.slotKey].durability.style.visibility = "hidden";
        _this.GUI.inventoryBar.slots[this.slotKey].equipped.style.visibility = "hidden";
        _this.GUI.inventoryBar.slots[this.slotKey].addButton.style.visibility = "hidden";

        // Reset the catalogue entry so it doesn't show up in the tooltip.
        this.catalogueEntry = null;

        // If this item was being used in crafting when removed, update the crafting panel.
        if(this.craftingComponent !== null){
            _this.craftingManager.removeComponent(this.craftingComponent.number);
        }
    }

    updateDurability (value) {
        this.durability = value;
        // Get the durability of the item as a proportion of the max durability, to use as the meter source image.
        const meterNumber = Math.floor((this.durability / this.maxDurability) * 10);
        _this.GUI.inventoryBar.slots[this.slotKey].durability.src = "assets/img/gui/hud/durability-meter-" + meterNumber + ".png";
    }
}

export default InventorySlot;