
const Pickup = require('./Pickup');

class PickupString extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupString;

PickupString.prototype.registerEntityType();
PickupString.prototype.ItemType = require('../../../items/ItemString');
