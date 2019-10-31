
const Merchant = require('./Merchant');

class Ruler extends Merchant {}
module.exports = Ruler;

Ruler.prototype.registerEntityType();
Ruler.prototype.faction = Merchant.prototype.Factions.Citizens;
Ruler.prototype.shop = new (require('./../../../../../../Shops')).Ruler();