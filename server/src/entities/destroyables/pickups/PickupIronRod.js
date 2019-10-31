
const Pickup = require('./Pickup');

class PickupIronRod extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupIronRod;

PickupIronRod.prototype.registerEntityType();
PickupIronRod.prototype.ItemType = require('../../../items/ItemIronRod');
