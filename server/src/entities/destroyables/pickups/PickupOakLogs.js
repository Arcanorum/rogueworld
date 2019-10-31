
const Pickup = require('./Pickup');

class PickupOakLogs extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupOakLogs;

PickupOakLogs.prototype.registerEntityType();
PickupOakLogs.prototype.ItemType = require('../../../items/ItemOakLogs');
