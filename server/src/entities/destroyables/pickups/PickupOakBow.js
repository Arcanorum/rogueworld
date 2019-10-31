
const Pickup = require('./Pickup');

class PickupOakBow extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupOakBow;

PickupOakBow.prototype.registerEntityType();
PickupOakBow.prototype.ItemType = require('../../../items/holdable/weapons/bows/ItemOakBow');
