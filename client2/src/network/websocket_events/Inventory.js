// import ItemTypes from "../catalogues/ItemTypes";
import { setAttackCursor, setDefaultCursor } from "../../shared/Cursors";
import Utils from "../../shared/Utils";
import eventResponses from "./EventResponses";

const ItemTypes = {}; // temp

export default () => {
    eventResponses.add_item = (data) => {
        // console.log("add item event:", data);
        window.gameScene.player.inventory[data.slotKey].fill(
            ItemTypes[data.typeNumber], data.durability, data.maxDurability,
        );
    };

    eventResponses.remove_item = (data) => {
        // console.log("remove item event:", data);
        window.gameScene.player.inventory[data].empty();
    };

    eventResponses.inventory_full = () => {
        window.gameScene.GUI.textCounterSetText(window.gameScene.GUI.inventoryBar.message, Utils.getTextDef("Inventory full warning"));
    };

    /**
     * When an item is used, such as attacking with a weapon, drinking a potion, eating
     * food, firing an arrow, etc. Generally when an item to lose durability.
     * Does NOT trigger for item state changes, like equipping/unequipping an item.
     * @param {*} data
     * @param {Number} data.typeNumber
     */
    eventResponses.item_used = (data) => {
        // console.log("item used event:", data);
        window.gameScene.soundManager.items.playUsedSound(data.itemTypeNumber);
    };

    eventResponses.item_broken = () => {
        window.gameScene.GUI.textCounterSetText(window.gameScene.GUI.inventoryBar.message, Utils.getTextDef("Item broken warning"));
    };

    eventResponses.item_dropped = (data) => {
        window.gameScene.soundManager.items.playDroppedSound(data.itemTypeNumber);
    };

    eventResponses.equip_clothes = (data) => {
        // console.log("equip_clothes:", data);
        const { clothes } = window.gameScene.dynamics[data.id].spriteContainer;
        clothes.visible = true;
        clothes.clothesName = ItemTypes[data.typeNumber].translationID;
        clothes.setFrame(
            clothes.clothesFrames[clothes.clothesName][clothes.parentContainer.direction],
        );
    };

    eventResponses.unequip_clothes = (data) => {
        // console.log("unequip clothes:", data);
        window.gameScene.dynamics[data].spriteContainer.clothes.visible = false;
    };

    eventResponses.activate_ammunition = (data) => {
        // Show the equipped icon on the inventory slot.
        const slot = window.gameScene.GUI.inventoryBar.slots[data];
        slot.equipped.src = "assets/img/gui/hud/ammunition-icon.png";
        slot.equipped.style.visibility = "visible";
    };

    eventResponses.deactivate_ammunition = (data) => {
        // Hide the equipped icon on the inventory slot.
        window.gameScene.GUI.inventoryBar.slots[data].equipped.style.visibility = "hidden";
    };

    eventResponses.activate_clothing = (data) => {
        // console.log("activate_clothing:", data);
        // Show the equipped icon on the inventory slot.
        const slot = window.gameScene.GUI.inventoryBar.slots[data.slotKey];
        slot.equipped.src = "assets/img/gui/hud/clothing-icon.png";
        slot.equipped.style.visibility = "visible";

        window.gameScene.soundManager.items.playEquippedSound(
            data.itemTypeNumber,
        );
    };

    eventResponses.deactivate_clothing = (data) => {
        // console.log("deactivate_clothing:", data);
        // Hide the equipped icon on the inventory slot.
        window.gameScene.GUI.inventoryBar.slots[data.slotKey].equipped.style.visibility = "hidden";
    };

    eventResponses.activate_holding = (data) => {
        // window.gameScene.player.holdingItem = true;
        // Show the equipped icon on the inventory slot.
        window.gameScene.GUI.inventoryBar.slots[data.slotKey].equipped.src = "assets/img/gui/hud/holding-icon.png";
        window.gameScene.GUI.inventoryBar.slots[data.slotKey].equipped.style.visibility = "visible";
        // Change the cursor to the attack icon.
        setAttackCursor();
        // Play sound when an item is held (i.e. a weapon).
        window.gameScene.soundManager.items.playEquippedSound(
            data.itemTypeNumber,
        );
    };

    eventResponses.deactivate_holding = (data) => {
        // window.gameScene.player.holdingItem = false;
        // Hide the equipped icon on the inventory slot.
        window.gameScene.GUI.inventoryBar.slots[data.slotKey].equipped.style.visibility = "hidden";
        window.gameScene.GUI.spellBar.hide();
        // Change the cursor back to what it was before.
        setDefaultCursor();

        window.gameScene.soundManager.items.playUnequippedSound(
            data.itemTypeNumber,
        );
    };

    /**
     *
     * @param data - The type number of the spell book being held.
     */
    eventResponses.activate_spell_book = (data) => {
        window.gameScene.GUI.spellBar.changeSpellBook(data[1]);
        window.gameScene.GUI.spellBar.show();
    };
};
