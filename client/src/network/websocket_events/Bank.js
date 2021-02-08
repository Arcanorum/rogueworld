import ItemTypes from "../../catalogues/ItemTypes.json";
import eventResponses from "./EventResponses";

export default () => {
    eventResponses.bank_item_deposited = (data) => {
        // console.log("bank_item_deposited, data:", data);
        window.gameScene.player.bankManager.addItemToContents(
            data.slotIndex, ItemTypes[data.typeNumber], data.durability, data.maxDurability,
        );
    };

    eventResponses.bank_item_withdrawn = (data) => {
        // console.log("bank_item_withdrawn, data:", data);
        window.gameScene.player.bankManager.removeItemFromContents(data);
    };
};
