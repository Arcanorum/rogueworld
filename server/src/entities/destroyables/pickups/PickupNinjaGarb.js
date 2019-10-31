
const Pickup = require('./Pickup');

class NinjaGarb extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = NinjaGarb;

NinjaGarb.prototype.registerEntityType();

NinjaGarb.prototype.ItemType = require('../../../items/clothes/ItemNinjaGarb');
