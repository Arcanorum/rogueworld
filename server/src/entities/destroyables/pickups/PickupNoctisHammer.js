
const Pickup = require('./Pickup');

class PickupNoctisHammer extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupNoctisHammer;

PickupNoctisHammer.prototype.registerEntityType();
PickupNoctisHammer.prototype.ItemType = require('../../../items/holdable/weapons/ItemNoctisHammer');
