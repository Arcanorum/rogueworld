
const Pickup = require('./Pickup');

class PickupFabric extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupFabric;

PickupFabric.prototype.registerEntityType();
PickupFabric.prototype.ItemType = require('../../../items/ItemFabric');
