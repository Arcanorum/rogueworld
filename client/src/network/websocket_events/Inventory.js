import ItemTypes from "../../catalogues/ItemTypes.json";
import { setAttackCursor, setDefaultCursor } from "../../shared/Cursors";
import Utils from "../../shared/Utils";
import eventResponses from "./EventResponses";
import { InventoryState } from "../../shared/state/States";
import dungeonz from "../../shared/Global";

export default () => {
    eventResponses.add_inventory_item = (data) => {
        InventoryState.addToInventory(data);
    };

    eventResponses.remove_inventory_item = (data) => {
        InventoryState.removeFromInventory(data);
    };

    eventResponses.remove_all_inventory_items = () => {
        InventoryState.removeAllFromInventory();
    };

    eventResponses.modify_inventory_item = (data) => {
        InventoryState.modifyItem(data);
    };

    eventResponses.inventory_weight = (data) => {
        InventoryState.setWeight(data);
    };

    eventResponses.inventory_max_weight = (data) => {
        InventoryState.setMaxWeight(data);
    };

    /**
     * When an item is used, such as attacking with a weapon, drinking a potion, eating
     * food, firing an arrow, etc. Generally when an item to lose durability.
     * Does NOT trigger for item state changes, like equipping/unequipping an item.
     * @param {*} data
     * @param {Number} data.typeCode
     */
    eventResponses.item_used = (data) => {
        // console.log("item used event:", data);
        dungeonz.gameScene.soundManager.effects.playUsedSound(data.itemTypeCode);
    };

    eventResponses.item_broken = () => {
        // dungeonz.gameScene.GUI.textCounterSetText(dungeonz.gameScene.GUI.inventoryBar.message, Utils.getTextDef("Item broken warning"));
    };

    eventResponses.item_dropped = (data) => {
        dungeonz.gameScene.soundManager.effects.playDroppedSound(data.itemTypeCode);
    };

    eventResponses.equip_clothes = (data) => {
        const { clothes } = dungeonz.gameScene.dynamics[data.id].spriteContainer;
        clothes.visible = true;
        clothes.clothesName = ItemTypes[data.typeCode].translationID;
        clothes.setFrame(
            clothes.clothesFrames[clothes.clothesName][clothes.parentContainer.direction],
        );
    };

    eventResponses.unequip_clothes = (data) => {
        dungeonz.gameScene.dynamics[data].spriteContainer.clothes.visible = false;
    };

    eventResponses.activate_ammunition = (data) => {
        // Show the equipped icon on the inventory slot.
        const item = InventoryState.items[data];
        InventoryState.setAmmunition(item);
    };

    eventResponses.deactivate_ammunition = () => {
        // Hide the equipped icon on the inventory slot.
        InventoryState.setAmmunition(null);
    };

    eventResponses.activate_clothing = (data) => {
        // console.log("activate_clothing:", data);
        // Show the equipped icon on the inventory slot.
        const item = InventoryState.items[data];

        InventoryState.setClothing(item);

        dungeonz.gameScene.soundManager.effects.playEquippedSound(
            item.typeCode,
        );
    };

    eventResponses.deactivate_clothing = () => {
        // console.log("deactivate_clothing");

        InventoryState.setClothing(null);
    };

    eventResponses.activate_holding = (data) => {
        const item = InventoryState.items[data];

        InventoryState.setHolding(item);

        // Play sound when an item is held (i.e. a weapon).
        dungeonz.gameScene.soundManager.effects.playEquippedSound(
            item.typeCode,
        );

        // TODO
        // Change the cursor to the attack icon.
        // setAttackCursor();
    };

    eventResponses.deactivate_holding = () => {
        const item = InventoryState.holding;

        dungeonz.gameScene.soundManager.effects.playUnequippedSound(
            item.typeCode,
        );

        InventoryState.setHolding(null);

        // TODO
        // Change the cursor back to what it was before.
        // setDefaultCursor();
    };

    /**
     *
     * @param data - The type number of the spell book being held.
     */
    eventResponses.activate_spell_book = (data) => {
        // dungeonz.gameScene.GUI.spellBar.changeSpellBook(data[1]);
        // dungeonz.gameScene.GUI.spellBar.show();
    };
};
