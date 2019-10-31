
const Pickup = require('./Pickup');

class PickupNoctisPickaxe extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupNoctisPickaxe;

PickupNoctisPickaxe.prototype.registerEntityType();
PickupNoctisPickaxe.prototype.ItemType = require('../../../items/ItemNoctisPickaxe');
