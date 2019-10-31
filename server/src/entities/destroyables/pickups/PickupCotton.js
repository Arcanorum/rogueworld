
const Pickup = require('./Pickup');

class PickupCotton extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupCotton;

PickupCotton.prototype.registerEntityType();
PickupCotton.prototype.ItemType = require('../../../items/ItemCotton');
