
const Pickup = require('./Pickup');

class PickupNoctisArmour extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupNoctisArmour;

PickupNoctisArmour.prototype.registerEntityType();
PickupNoctisArmour.prototype.ItemType = require('../../../items/clothes/ItemNoctisArmour');
