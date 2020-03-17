
const Pickup = require('./Pickup');

class PickupStormcaller extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupStormcaller;

PickupStormcaller.prototype.registerEntityType();
PickupStormcaller.prototype.ItemType = require('../../../items/holdable/weapons/ItemStormcaller');
