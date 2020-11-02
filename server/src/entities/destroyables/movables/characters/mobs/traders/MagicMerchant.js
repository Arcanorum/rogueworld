const Merchant = require("./Merchant");

class MagicMerchant extends Merchant {}
module.exports = MagicMerchant;

MagicMerchant.prototype.shop = new (require('./../../../../../../gameplay/Shops')).Magic();