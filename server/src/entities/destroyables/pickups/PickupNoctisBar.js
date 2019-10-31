
const Pickup = require('./Pickup');

class PickupNoctisBar extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupNoctisBar;

PickupNoctisBar.prototype.registerEntityType();
PickupNoctisBar.prototype.ItemType = require('../../../items/ItemNoctisBar');
