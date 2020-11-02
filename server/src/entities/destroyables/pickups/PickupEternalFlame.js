
const Pickup = require('./Pickup');

class PickupEternalFlame extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupEternalFlame;

PickupEternalFlame.prototype.registerEntityType();
PickupEternalFlame.prototype.ItemType = require('../../../items/holdable/weapons/ItemEternalFlame');
