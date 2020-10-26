const Merchant = require('./Merchant');

class ToolMerchant extends Merchant {}
module.exports = ToolMerchant;

ToolMerchant.prototype.shop = new (require('./../../../../../../gameplay/Shops')).Tools();