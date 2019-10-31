
const Pickup = require('./Pickup');

class PickupBlueKey extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupBlueKey;

PickupBlueKey.prototype.registerEntityType();
PickupBlueKey.prototype.ItemType = require('../../../items/ItemBlueKey');
