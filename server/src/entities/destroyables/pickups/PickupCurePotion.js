
const Pickup = require('./Pickup');

class PickupCurePotion extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupCurePotion;

PickupCurePotion.prototype.registerEntityType();
PickupCurePotion.prototype.ItemType = require('../../../items/ItemCurePotion');
