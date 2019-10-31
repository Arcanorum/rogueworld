
const Pickup = require('./Pickup');

class PickupFighterKey extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupFighterKey;

PickupFighterKey.prototype.registerEntityType();
PickupFighterKey.prototype.ItemType = require('../../../items/ItemFighterKey');
