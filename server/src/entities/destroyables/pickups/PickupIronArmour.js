
const Pickup = require('./Pickup');

class PickupIronArmour extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupIronArmour;

PickupIronArmour.prototype.registerEntityType();
PickupIronArmour.prototype.ItemType = require('../../../items/clothes/ItemIronArmour');
