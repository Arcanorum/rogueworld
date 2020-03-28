
const Merchant = require('./Merchant');

class OmniMerchant extends Merchant {}
module.exports = OmniMerchant;

OmniMerchant.prototype.registerEntityType();
OmniMerchant.prototype.faction = Merchant.prototype.Factions.Citizens;
OmniMerchant.prototype.shop = new (require('./../../../../../../gameplay/Shops')).Omni();