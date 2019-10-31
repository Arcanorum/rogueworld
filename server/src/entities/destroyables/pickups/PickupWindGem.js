
const Pickup = require('./Pickup');

class PickupWindGem extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupWindGem;

PickupWindGem.prototype.registerEntityType();
PickupWindGem.prototype.ItemType = require('../../../items/ItemWindGem');
