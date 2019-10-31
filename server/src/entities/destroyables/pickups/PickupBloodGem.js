
const Pickup = require('./Pickup');

class PickupBloodGem extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupBloodGem;

PickupBloodGem.prototype.registerEntityType();
PickupBloodGem.prototype.ItemType = require('../../../items/ItemBloodGem');
