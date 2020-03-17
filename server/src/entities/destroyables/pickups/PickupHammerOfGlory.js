
const Pickup = require('./Pickup');

class PickupHammerOfGlory extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupHammerOfGlory;

PickupHammerOfGlory.prototype.registerEntityType();
PickupHammerOfGlory.prototype.ItemType = require('../../../items/holdable/weapons/ItemHammerOfGlory');
