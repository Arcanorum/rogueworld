
const Pickup = require('./Pickup');

class PickupSuperWindStaff extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupSuperWindStaff;

PickupSuperWindStaff.prototype.registerEntityType();
PickupSuperWindStaff.prototype.ItemType = require('../../../items/holdable/weapons/ItemSuperWindStaff');
