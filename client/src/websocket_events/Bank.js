import ItemTypes from "../catalogues/ItemTypes";

export default (eventResponses) => {

    eventResponses.bank_item_deposited = (data) => {
        //console.log("bank_item_deposited, data:", data);
        _this.player.bankManager.addItemToContents(data.slotIndex, ItemTypes[data.typeNumber], data.durability, data.maxDurability);
    };

    eventResponses.bank_item_withdrawn = (data) => {
        //console.log("bank_item_withdrawn, data:", data);
        _this.player.bankManager.removeItemFromContents(data);
    };
};