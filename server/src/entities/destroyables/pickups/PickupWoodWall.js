
const Pickup = require('./Pickup');

class PickupWoodWall extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupWoodWall;

PickupWoodWall.prototype.registerEntityType();
PickupWoodWall.prototype.ItemType = require('../../../items/ItemOakLogs'); // TODO set back to wood wall
