
const Pickup = require('./Pickup');

class PickupExpOrbToolery extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupExpOrbToolery;

PickupExpOrbToolery.prototype.registerEntityType();
PickupExpOrbToolery.prototype.ItemType = require('../../../items/ItemExpOrbToolery');
