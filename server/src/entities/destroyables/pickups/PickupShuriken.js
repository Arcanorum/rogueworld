
const Pickup = require('./Pickup');

class PickupShuriken extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupShuriken;

PickupShuriken.prototype.registerEntityType();
PickupShuriken.prototype.ItemType = require('../../../items/holdable/weapons/ItemShuriken');
