
const Pickup = require('./Pickup');

class PickupIronDagger extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupIronDagger;

PickupIronDagger.prototype.registerEntityType();
PickupIronDagger.prototype.ItemType = require('../../../items/holdable/weapons/ItemIronDagger');
