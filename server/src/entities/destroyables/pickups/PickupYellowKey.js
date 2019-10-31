
const Pickup = require('./Pickup');

class PickupYellowKey extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupYellowKey;

PickupYellowKey.prototype.registerEntityType();
PickupYellowKey.prototype.ItemType = require('../../../items/ItemYellowKey');
