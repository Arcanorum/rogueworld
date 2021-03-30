const Merchant = require("./Merchant");
const ShopTypesList = require("../../../../../../shops/ShopTypesList");

class MeleeMerchant extends Merchant {}

MeleeMerchant.prototype.shop = ShopTypesList.Melee;

module.exports = MeleeMerchant;
