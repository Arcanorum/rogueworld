
const Pickup = require('./Pickup');

class PickupExpOrbGathering extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupExpOrbGathering;

PickupExpOrbGathering.prototype.registerEntityType();
PickupExpOrbGathering.prototype.ItemType = require('../../../items/ItemExpOrbGathering');
