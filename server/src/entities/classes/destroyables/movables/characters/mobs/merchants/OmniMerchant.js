const Merchant = require("./Merchant");
const ShopTypesList = require("../../../../../../../shops/ShopTypesList");

class OmniMerchant extends Merchant {}

OmniMerchant.prototype.shop = ShopTypesList.Omni;

module.exports = OmniMerchant;
