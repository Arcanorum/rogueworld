const Merchant = require("./Merchant");
const ShopTypesList = require("../../../../../../../shops/ShopTypesList");

class ArenaMaster extends Merchant {}

ArenaMaster.prototype.shop = ShopTypesList.Arena;

module.exports = ArenaMaster;
