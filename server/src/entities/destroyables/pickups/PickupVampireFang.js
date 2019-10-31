
const Pickup = require('./Pickup');

class PickupVampireFang extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupVampireFang;

PickupVampireFang.prototype.registerEntityType();
PickupVampireFang.prototype.ItemType = require('../../../items/holdable/weapons/ItemVampireFang');
