
const Pickup = require('./Pickup');

class PickupNoctisArrows extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupNoctisArrows;

PickupNoctisArrows.prototype.registerEntityType();
PickupNoctisArrows.prototype.ItemType = require('../../../items/ammunition/ItemNoctisArrows');
