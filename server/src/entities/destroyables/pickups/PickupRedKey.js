
const Pickup = require('./Pickup');

class PickupRedKey extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupRedKey;

PickupRedKey.prototype.registerEntityType();
PickupRedKey.prototype.ItemType = require('../../../items/ItemRedKey');
