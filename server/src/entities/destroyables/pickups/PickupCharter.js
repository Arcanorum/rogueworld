
const Pickup = require('./Pickup');

class PickupCharter extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupCharter;

PickupCharter.prototype.registerEntityType();
PickupCharter.prototype.ItemType = require('../../../items/ItemOakLogs'); // TODO set back to charter
