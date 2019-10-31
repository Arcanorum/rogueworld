
const Pickup = require('./Pickup');

class PickupNecromancerRobe extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupNecromancerRobe;

PickupNecromancerRobe.prototype.registerEntityType();
PickupNecromancerRobe.prototype.ItemType = require('../../../items/clothes/ItemNecromancerRobe');
