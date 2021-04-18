const settings = require("../../settings.js");
const ItemsList = require("../items/ItemsList.js");
const ItemConfig = require("./ItemConfig.js");
const Utils = require("../Utils.js");

module.exports.list = [];

module.exports.populateList = () => {
    settings.STARTER_INVENTORY_ITEMS.forEach((itemConfigSetting) => {
        if (!ItemsList.BY_NAME[itemConfigSetting.itemName]) {
            Utils.error("Item type name given in STARTER_INVENTORY_ITEMS list is not in the item types list:", itemConfigSetting.itemName);
        }
        module.exports.list.push(new ItemConfig({
            ItemType: ItemsList.BY_NAME[itemConfigSetting.itemName],
            quantity: itemConfigSetting.quantity,
            durability: itemConfigSetting.durability,
            maxDurability: itemConfigSetting.maxDurability,
        }));
    });
};
