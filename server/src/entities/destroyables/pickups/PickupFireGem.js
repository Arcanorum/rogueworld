
const Pickup = require('./Pickup');

class PickupFireGem extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupFireGem;

PickupFireGem.prototype.registerEntityType();
PickupFireGem.prototype.ItemType = require('../../../items/ItemFireGem');
