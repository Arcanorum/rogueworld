
const Pickup = require('./Pickup');

class PickupIronHatchet extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupIronHatchet;

PickupIronHatchet.prototype.registerEntityType();
PickupIronHatchet.prototype.ItemType = require('../../../items/ItemIronHatchet');