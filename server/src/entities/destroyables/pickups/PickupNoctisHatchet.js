
const Pickup = require('./Pickup');

class PickupNoctisHatchet extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupNoctisHatchet;

PickupNoctisHatchet.prototype.registerEntityType();
PickupNoctisHatchet.prototype.ItemType = require('../../../items/ItemNoctisHatchet');
