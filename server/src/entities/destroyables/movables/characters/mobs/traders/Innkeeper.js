
const Merchant = require('./Merchant');

class Innkeeper extends Merchant {}
module.exports = Innkeeper;

Innkeeper.prototype.registerEntityType();
Innkeeper.prototype.faction = Merchant.prototype.Factions.Citizens;
Innkeeper.prototype.shop = new (require('./../../../../../../Shops')).Inn();