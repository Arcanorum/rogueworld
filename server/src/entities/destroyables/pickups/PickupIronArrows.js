
const Pickup = require('./Pickup');

class PickupIronBar extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupIronBar;

PickupIronBar.prototype.registerEntityType();
PickupIronBar.prototype.ItemType = require('../../../items/ammunition/ItemIronArrows');
