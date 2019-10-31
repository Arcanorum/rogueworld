
const Pickup = require('./Pickup');

class PickupBankChest extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupBankChest;

PickupBankChest.prototype.registerEntityType();
PickupBankChest.prototype.ItemType = require('../../../items/ItemOakLogs'); // TODO set back to bank chest
