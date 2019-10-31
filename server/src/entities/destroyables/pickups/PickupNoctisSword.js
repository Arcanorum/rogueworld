
const Pickup = require('./Pickup');

class PickupNoctisSword extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupNoctisSword;

PickupNoctisSword.prototype.registerEntityType();
PickupNoctisSword.prototype.ItemType = require('../../../items/holdable/weapons/ItemNoctisSword');
