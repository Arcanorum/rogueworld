
const Pickup = require('./Pickup');

class PickupCloak extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupCloak;

PickupCloak.prototype.registerEntityType();

PickupCloak.prototype.ItemType = require('../../../items/clothes/ItemCloak');
