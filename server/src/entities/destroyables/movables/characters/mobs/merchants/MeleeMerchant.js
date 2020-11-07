const Merchant = require("./Merchant");

class MeleeMerchant extends Merchant {}
module.exports = MeleeMerchant;

MeleeMerchant.prototype.shop = new (require('./../../../../../../gameplay/Shops')).Melee();