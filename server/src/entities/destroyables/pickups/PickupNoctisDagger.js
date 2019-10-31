
const Pickup = require('./Pickup');

class PickupNoctisDagger extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupNoctisDagger;

PickupNoctisDagger.prototype.registerEntityType();
PickupNoctisDagger.prototype.ItemType = require('../../../items/holdable/weapons/ItemNoctisDagger');
