
const Pickup = require('./Pickup');

class PickupPitKey extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupPitKey;

PickupPitKey.prototype.registerEntityType();
PickupPitKey.prototype.ItemType = require('../../../items/ItemPitKey');
