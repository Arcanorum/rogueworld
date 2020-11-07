const Merchant = require("./Merchant");

class RangedMerchant extends Merchant {}
module.exports = RangedMerchant;

RangedMerchant.prototype.shop = new (require('./../../../../../../gameplay/Shops')).Ranged();