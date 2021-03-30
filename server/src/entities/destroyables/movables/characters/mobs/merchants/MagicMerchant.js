const Merchant = require("./Merchant");
const ShopTypesList = require("../../../../../../shops/ShopTypesList");

class MagicMerchant extends Merchant {}

MagicMerchant.prototype.shop = ShopTypesList.Magic;

module.exports = MagicMerchant;
