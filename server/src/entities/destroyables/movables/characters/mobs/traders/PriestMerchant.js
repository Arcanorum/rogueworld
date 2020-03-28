
const Merchant = require('./Merchant');

class PriestMerchant extends Merchant {}
module.exports = PriestMerchant;

PriestMerchant.prototype.registerEntityType();
PriestMerchant.prototype.faction = Merchant.prototype.Factions.Citizens;
//PriestMerchant.prototype.shop = new (require('./../../../../../../gameplay/Shops')).Respawns();