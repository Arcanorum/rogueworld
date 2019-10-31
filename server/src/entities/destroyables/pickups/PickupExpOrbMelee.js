
const Pickup = require('./Pickup');

class PickupExpOrbMelee extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupExpOrbMelee;

PickupExpOrbMelee.prototype.registerEntityType();
PickupExpOrbMelee.prototype.ItemType = require('../../../items/ItemExpOrbMelee');
