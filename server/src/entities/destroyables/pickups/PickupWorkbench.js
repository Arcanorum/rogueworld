
const Pickup = require('./Pickup');

class PickupWorkbench extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupWorkbench;

PickupWorkbench.prototype.registerEntityType();
PickupWorkbench.prototype.ItemType = require('../../../items/ItemOakLogs'); // TODO set back to workbench
