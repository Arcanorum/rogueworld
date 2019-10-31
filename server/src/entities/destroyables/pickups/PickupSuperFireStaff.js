
const Pickup = require('./Pickup');

class PickupSuperFireStaff extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupSuperFireStaff;

PickupSuperFireStaff.prototype.registerEntityType();
PickupSuperFireStaff.prototype.ItemType = require('../../../items/holdable/weapons/ItemSuperFireStaff');
