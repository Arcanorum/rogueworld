
const Pickup = require('./Pickup');

class PickupFirLogs extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupFirLogs;

PickupFirLogs.prototype.registerEntityType();
PickupFirLogs.prototype.ItemType = require('../../../items/ItemFirLogs');
