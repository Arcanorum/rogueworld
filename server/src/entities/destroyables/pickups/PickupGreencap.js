
const Pickup = require('./Pickup');

class PickupGreencap extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupGreencap;

PickupGreencap.prototype.registerEntityType();
PickupGreencap.prototype.ItemType = require('../../../items/ItemGreencap');
