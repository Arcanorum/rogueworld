
const Pickup = require('./Pickup');

class PickupWoodDoor extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupWoodDoor;

PickupWoodDoor.prototype.registerEntityType();
PickupWoodDoor.prototype.ItemType = require('../../../items/ItemOakLogs'); // TODO set back to wood door
