import ItemTypes from "../../catalogues/ItemTypes.json";
import dungeonz from "../../shared/Global";
import eventResponses from "./EventResponses";

export default () => {
    eventResponses.bank_item_deposited = (data) => {
        // console.log("bank_item_deposited, data:", data);
        dungeonz.gameScene.player.bankManager.addItemToContents(
            data.slotIndex, ItemTypes[data.typeCode], data.durability, data.maxDurability,
        );
    };

    eventResponses.bank_item_withdrawn = (data) => {
        // console.log("bank_item_withdrawn, data:", data);
        dungeonz.gameScene.player.bankManager.removeItemFromContents(data);
    };
};
