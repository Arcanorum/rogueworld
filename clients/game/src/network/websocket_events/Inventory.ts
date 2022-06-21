import { setAttackCursor, setDefaultCursor } from '../../shared/Cursors';
import eventResponses from './EventResponses';
import { InventoryState } from '../../shared/state';
import Global from '../../shared/Global';
import ItemState from '../../shared/ItemState';

const Inventory = () => {
    eventResponses.add_inventory_item = (data: ItemState) => {
        InventoryState.addToInventory(data);
    };

    eventResponses.remove_inventory_item = (data: number) => {
        InventoryState.removeFromInventory(data);
    };

    eventResponses.remove_all_inventory_items = () => {
        InventoryState.removeAllFromInventory();
    };

    eventResponses.modify_inventory_item = (data: {
        slotIndex: number;
        quantity: number;
        totalWeight: number;
    }) => {
        InventoryState.modifyItem(data);
    };

    eventResponses.inventory_weight = (data: number) => {
        InventoryState.setWeight(data);
    };

    eventResponses.inventory_max_weight = (data: number) => {
        InventoryState.setMaxWeight(data);
    };

    /**
     * When an item is used, such as attacking with a weapon, drinking a potion, eating
     * food, firing an arrow, etc.
     * Does NOT trigger for item state changes, like equipping/unequipping an item.
     */
    eventResponses.item_used = (data: {itemTypeCode: string}) => {
        // console.log("item used event:", data);
        Global.gameScene.soundManager.effects.playUsedSound(data.itemTypeCode);
    };

    eventResponses.item_broken = () => {
        // Global.gameScene.GUI.textCounterSetText(Global.gameScene.GUI.inventoryBar.message, getTextDef("Item broken warning"));
    };

    eventResponses.item_dropped = (data: {itemTypeCode: string}) => {
        Global.gameScene.soundManager.effects.playDroppedSound(data.itemTypeCode);
    };

    // eventResponses.equip_clothes = (data) => {
    //     const { clothes } = Global.gameScene.dynamics[data.id].spriteContainer;
    //     clothes.visible = true;
    //     clothes.clothesName = Config.ItemTypes[data.typeCode].translationId;
    //     clothes.setFrame(
    //         clothes.clothesFrames[clothes.clothesName][clothes.parentContainer.direction],
    //     );
    // };

    // eventResponses.unequip_clothes = (data) => {
    //     Global.gameScene.dynamics[data].spriteContainer.clothes.visible = false;
    // };

    eventResponses.activate_ammunition = (data: number) => {
        // Show the equipped icon on the inventory slot.
        const item = InventoryState.items[data];
        InventoryState.setAmmunition(item);
    };

    eventResponses.deactivate_ammunition = () => {
        // Hide the equipped icon on the inventory slot.
        InventoryState.setAmmunition(null);
    };

    eventResponses.activate_clothing = (data: number) => {
        // console.log("activate_clothing:", data);
        // Show the equipped icon on the inventory slot.
        const item = InventoryState.items[data];

        InventoryState.setClothing(item);

        Global.gameScene.soundManager.effects.playEquippedSound(
            item.typeCode,
        );
    };

    eventResponses.deactivate_clothing = () => {
        // console.log("deactivate_clothing");

        InventoryState.setClothing(null);
    };

    eventResponses.activate_holding = (data: number) => {
        const item = InventoryState.items[data];

        InventoryState.setHolding(item);

        // Play sound when an item is held (i.e. a weapon).
        Global.gameScene.soundManager.effects.playEquippedSound(
            item.typeCode,
        );

        // Change the cursor to the attack icon.
        setAttackCursor();
    };

    eventResponses.deactivate_holding = () => {
        const item = InventoryState.holding;

        if(item) {
            Global.gameScene.soundManager.effects.playUnequippedSound(
                item.typeCode,
            );
        }

        InventoryState.setHolding(null);

        // Change the cursor back to what it was before.
        setDefaultCursor();
    };
};

export default Inventory;
