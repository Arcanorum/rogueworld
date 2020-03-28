
const Merchant = require('./Merchant');

class ArenaMaster extends Merchant {}
module.exports = ArenaMaster;

ArenaMaster.prototype.registerEntityType();
ArenaMaster.prototype.faction = Merchant.prototype.Factions.Citizens;
ArenaMaster.prototype.shop = new (require('./../../../../../../gameplay/Shops')).Arena();