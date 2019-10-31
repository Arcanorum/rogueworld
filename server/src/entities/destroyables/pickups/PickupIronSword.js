
const Pickup = require('./Pickup');

class PickupIronSword extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupIronSword;

PickupIronSword.prototype.registerEntityType();
PickupIronSword.prototype.ItemType = require('../../../items/holdable/weapons/ItemIronSword');
