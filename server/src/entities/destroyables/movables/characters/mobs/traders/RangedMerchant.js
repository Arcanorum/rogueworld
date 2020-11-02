
const Merchant = require('./Merchant');

class RangedMerchant extends Merchant {}
module.exports = RangedMerchant;

RangedMerchant.prototype.registerEntityType();
RangedMerchant.prototype.faction = Merchant.prototype.Factions.Citizens;
RangedMerchant.prototype.shop = new (require('./../../../../../../gameplay/Shops')).Ranged();