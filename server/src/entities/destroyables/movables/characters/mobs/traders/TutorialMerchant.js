
const Merchant = require('./Merchant');

class TutorialMerchant extends Merchant {}
module.exports = TutorialMerchant;

TutorialMerchant.prototype.registerEntityType();
TutorialMerchant.prototype.faction = Merchant.prototype.Factions.Citizens;
TutorialMerchant.prototype.shop = new (require('./../../../../../../gameplay/Shops')).Tutorial();