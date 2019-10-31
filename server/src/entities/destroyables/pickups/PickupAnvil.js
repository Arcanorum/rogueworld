
const Pickup = require('./Pickup');

class PickupAnvil extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupAnvil;

PickupAnvil.prototype.registerEntityType();
PickupAnvil.prototype.ItemType = require('../../../items/ItemOakLogs'); //TODO set back to anvil
