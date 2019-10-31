
const Pickup = require('./Pickup');

class PickupFeathers extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupFeathers;

PickupFeathers.prototype.registerEntityType();
PickupFeathers.prototype.ItemType = require('../../../items/ItemFeathers');
