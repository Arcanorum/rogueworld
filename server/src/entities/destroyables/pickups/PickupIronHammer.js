
const Pickup = require('./Pickup');

class PickupIronHammer extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupIronHammer;

PickupIronHammer.prototype.registerEntityType();
PickupIronHammer.prototype.ItemType = require('../../../items/holdable/weapons/ItemIronHammer');