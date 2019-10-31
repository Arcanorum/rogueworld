
const Pickup = require('./Pickup');

class PickupEnergyPotion extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupEnergyPotion;

PickupEnergyPotion.prototype.registerEntityType();
PickupEnergyPotion.prototype.ItemType = require('../../../items/ItemEnergyPotion');
