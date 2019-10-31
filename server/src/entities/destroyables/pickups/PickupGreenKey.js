
const Pickup = require('./Pickup');

class PickupGreenKey extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupGreenKey;

PickupGreenKey.prototype.registerEntityType();
PickupGreenKey.prototype.ItemType = require('../../../items/ItemGreenKey');
