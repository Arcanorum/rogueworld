
const Pickup = require('./Pickup');

class PickupExpOrbMagic extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupExpOrbMagic;

PickupExpOrbMagic.prototype.registerEntityType();
PickupExpOrbMagic.prototype.ItemType = require('../../../items/ItemExpOrbMagic');
