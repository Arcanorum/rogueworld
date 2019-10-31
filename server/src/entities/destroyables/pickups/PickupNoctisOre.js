
const Pickup = require('./Pickup');

class PickupNoctisOre extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupNoctisOre;

PickupNoctisOre.prototype.registerEntityType();
PickupNoctisOre.prototype.ItemType = require('../../../items/ItemNoctisOre');
