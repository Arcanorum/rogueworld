const settings = require("../../settings.js");
const ItemsList = require("../ItemsList.js");
const ItemConfig = require("../inventory/ItemConfig.js");
const Utils = require("../Utils.js");

module.exports.list = [];

module.exports.populateList = () => {
    settings.STARTER_BANK_ITEMS.forEach((itemConfigSetting) => {
        if (!ItemsList.BY_NAME[itemConfigSetting.itemName]) {
            Utils.error("Item type name given in STARTER_BANK_ITEMS list is not in the item types list:", itemConfigSetting.itemName);
        }
        module.exports.list.push(new ItemConfig({
            ItemType: ItemsList.BY_NAME[itemConfigSetting.itemName],
            quantity: itemConfigSetting.quantity,
            durability: itemConfigSetting.durability,
            maxDurability: itemConfigSetting.maxDurability,
        }));
    });
};
