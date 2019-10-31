
const Pickup = require('./Pickup');

class PickupFurnace extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupFurnace;

PickupFurnace.prototype.registerEntityType();
PickupFurnace.prototype.ItemType = require('../../../items/ItemOakLogs'); // TODO set back to furnace
