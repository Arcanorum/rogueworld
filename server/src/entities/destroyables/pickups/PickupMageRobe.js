const Pickup = require('./Pickup');

class PickupMageRobe extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupMageRobe;

PickupMageRobe.prototype.registerEntityType();
PickupMageRobe.prototype.ItemType = require('../../../items/clothes/ItemMageRobe');
