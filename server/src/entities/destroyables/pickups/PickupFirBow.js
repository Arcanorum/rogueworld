
const Pickup = require('./Pickup');

class PickupFirBow extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupFirBow;

PickupFirBow.prototype.registerEntityType();
PickupFirBow.prototype.ItemType = require('../../../items/holdable/weapons/bows/ItemFirBow');
