
const Pickup = require('./Pickup');

class PickupNoctisRod extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupNoctisRod;

PickupNoctisRod.prototype.registerEntityType();
PickupNoctisRod.prototype.ItemType = require('../../../items/ItemNoctisRod');
