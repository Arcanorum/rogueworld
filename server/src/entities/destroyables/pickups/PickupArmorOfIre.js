
const Pickup = require('./Pickup');

class PickupArmorOfIre extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupArmorOfIre;

PickupArmorOfIre.prototype.registerEntityType();
PickupArmorOfIre.prototype.ItemType = require('../../../items/clothes/ItemArmorOfIre');
