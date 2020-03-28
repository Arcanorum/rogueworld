
const Merchant = require('./Merchant');

class MeleeMerchant extends Merchant {}
module.exports = MeleeMerchant;

MeleeMerchant.prototype.registerEntityType();
MeleeMerchant.prototype.faction = Merchant.prototype.Factions.Citizens;
MeleeMerchant.prototype.shop = new (require('./../../../../../../gameplay/Shops')).Melee();