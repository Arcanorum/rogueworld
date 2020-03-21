
const Pickup = require('./Pickup');

class PickupEtherweave extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupEtherweave;

PickupEtherweave.prototype.registerEntityType();
PickupEtherweave.prototype.ItemType = require('../../../items/clothes/ItemEtherweave');
