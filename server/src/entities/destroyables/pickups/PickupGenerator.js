
const Pickup = require('./Pickup');

class PickupGenerator extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupGenerator;

PickupGenerator.prototype.registerEntityType();
PickupGenerator.prototype.ItemType = require('../../../items/ItemOakLogs'); // TODO set back to generator
