
const Merchant = require('./Merchant');

class ToolMerchant extends Merchant {}
module.exports = ToolMerchant;

ToolMerchant.prototype.registerEntityType();
ToolMerchant.prototype.faction = Merchant.prototype.Factions.Citizens;
ToolMerchant.prototype.shop = new (require('./../../../../../../gameplay/Shops')).Tools();