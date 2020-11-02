
const Merchant = require('./Merchant');

class MagicMerchant extends Merchant {}
module.exports = MagicMerchant;

MagicMerchant.prototype.registerEntityType();
MagicMerchant.prototype.faction = Merchant.prototype.Factions.Citizens;
MagicMerchant.prototype.shop = new (require('./../../../../../../gameplay/Shops')).Magic();