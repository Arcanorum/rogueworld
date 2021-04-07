const Merchant = require("./Merchant");
const ShopTypesList = require("../../../../../../../shops/ShopTypesList");

class ToolMerchant extends Merchant {}

ToolMerchant.prototype.shop = ShopTypesList.Tools;

module.exports = ToolMerchant;
