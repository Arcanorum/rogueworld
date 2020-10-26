const Merchant = require('./Merchant');

class TutorialMerchant extends Merchant {}
module.exports = TutorialMerchant;

TutorialMerchant.prototype.shop = new (require('./../../../../../../gameplay/Shops')).Tutorial();