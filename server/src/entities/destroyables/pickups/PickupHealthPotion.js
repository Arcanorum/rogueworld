
const Pickup = require('./Pickup');

class PickupHealthPotion extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupHealthPotion;

PickupHealthPotion.prototype.registerEntityType();
PickupHealthPotion.prototype.ItemType = require('../../../items/ItemHealthPotion');
