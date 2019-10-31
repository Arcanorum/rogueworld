
const Pickup = require('./Pickup');

class PickupRedcap extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupRedcap;

PickupRedcap.prototype.registerEntityType();
PickupRedcap.prototype.ItemType = require('../../../items/ItemRedcap');
