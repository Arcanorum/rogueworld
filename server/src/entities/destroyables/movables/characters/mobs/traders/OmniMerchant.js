const Merchant = require('./Merchant');

class OmniMerchant extends Merchant {}
module.exports = OmniMerchant;

OmniMerchant.prototype.shop = new (require('./../../../../../../gameplay/Shops')).Omni();