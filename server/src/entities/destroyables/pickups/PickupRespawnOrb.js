
const Pickup = require('./Pickup');

class PickupRespawnOrb extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupRespawnOrb;

PickupRespawnOrb.prototype.registerEntityType();
PickupRespawnOrb.prototype.setItemType('ItemFireGem');
