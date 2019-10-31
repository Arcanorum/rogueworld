
const Pickup = require('./Pickup');

class PickupExpOrbRanged extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupExpOrbRanged;

PickupExpOrbRanged.prototype.registerEntityType();
PickupExpOrbRanged.prototype.ItemType = require('../../../items/ItemExpOrbRanged');
