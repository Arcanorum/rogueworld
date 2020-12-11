import ItemTypes from "../catalogues/ItemTypes";
import { setAttackCursor, setDefaultCursor, setHandCursor } from "../Cursors";

export default (eventResponses) => {

    eventResponses.add_item = (data) => {
        //console.log("add item event:", data);
        _this.player.inventory[data.slotKey].fill(ItemTypes[data.typeNumber], data.durability, data.maxDurability);
    };

    eventResponses.remove_item = (data) => {
        //console.log("remove item event:", data);
        _this.player.inventory[data].empty();
    };

    eventResponses.equip_clothes = (data) => {
        const clothes = _this.dynamics[data.id].spriteContainer.clothes;
        clothes.visible = true;
        clothes.clothesName = ItemTypes[data.typeNumber].translationID;
        clothes.setFrame(clothes.clothesFrames[clothes.clothesName][clothes.parentContainer.direction]);
    };

    eventResponses.unequip_clothes = (data) => {
        //console.log("unequip clothes:", data);
        _this.dynamics[data].spriteContainer.clothes.visible = false;
    };

    eventResponses.activate_ammunition = (data) => {
        // Show the equipped icon on the inventory slot.
        _this.GUI.inventoryBar.slots[data].equipped.src = 'assets/img/gui/hud/ammunition-icon.png';
        _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "visible";
    };

    eventResponses.deactivate_ammunition = (data) => {
        // Hide the equipped icon on the inventory slot.
        _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "hidden";
    };

    eventResponses.activate_clothing = (data) => {
        // Show the equipped icon on the inventory slot.
        _this.GUI.inventoryBar.slots[data].equipped.src = 'assets/img/gui/hud/clothing-icon.png';
        _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "visible";
        // Play sound when equipped clothing
        _this.sounds.item.clothingEquipped.play()
    };

    eventResponses.deactivate_clothing = (data) => {
        // Hide the equipped icon on the inventory slot.
        _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "hidden";
    };

    eventResponses.activate_holding = (data) => {
        _this.player.holdingItem = true;
        // Show the equipped icon on the inventory slot.
        _this.GUI.inventoryBar.slots[data].equipped.src = 'assets/img/gui/hud/holding-icon.png';
        _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "visible";
        // Change the cursor to the attack icon.
        setAttackCursor();
        // Play sound when equipped weapon
        _this.sounds.item.weaponEquipped.play()
    };

    eventResponses.deactivate_holding = (data) => {
        _this.player.holdingItem = false;
        // Hide the equipped icon on the inventory slot.
        _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "hidden";
        _this.GUI.spellBar.hide();
        // Change the cursor back to what it was before.
        setDefaultCursor();
    };

    /**
     *
     * @param data - The type number of the spell book being held.
     */
    eventResponses.activate_spell_book = (data) => {
        _this.GUI.spellBar.changeSpellBook(data[1]);
        _this.GUI.spellBar.show();
    };
}