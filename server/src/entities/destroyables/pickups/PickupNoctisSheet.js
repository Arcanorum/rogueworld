
const Pickup = require('./Pickup');

class PickupNoctisSheet extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupNoctisSheet;

PickupNoctisSheet.prototype.registerEntityType();
PickupNoctisSheet.prototype.ItemType = require('../../../items/ItemNoctisSheet');
