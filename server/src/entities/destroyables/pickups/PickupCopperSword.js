
const Pickup = require('./Pickup');

class PickupCopperSword extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupCopperSword;

PickupCopperSword.prototype.registerEntityType();
PickupCopperSword.prototype.ItemType = require('../../../items/holdable/weapons/ItemCopperSword');
