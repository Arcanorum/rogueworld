const Merchant = require("./Merchant");
const ShopTypesList = require("../../../../../../../shops/ShopTypesList");

class RangedMerchant extends Merchant {}

RangedMerchant.prototype.shop = ShopTypesList.Ranged;

module.exports = RangedMerchant;
