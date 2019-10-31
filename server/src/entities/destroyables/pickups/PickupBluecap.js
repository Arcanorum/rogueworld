
const Pickup = require('./Pickup');

class PickupBluecap extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupBluecap;

PickupBluecap.prototype.registerEntityType();
PickupBluecap.prototype.ItemType = require('../../../items/ItemBluecap');
