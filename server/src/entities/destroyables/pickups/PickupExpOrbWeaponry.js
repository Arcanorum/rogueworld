
const Pickup = require('./Pickup');

class PickupExpOrbWeaponry extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupExpOrbWeaponry;

PickupExpOrbWeaponry.prototype.registerEntityType();
PickupExpOrbWeaponry.prototype.ItemType = require('../../../items/ItemExpOrbWeaponry');
