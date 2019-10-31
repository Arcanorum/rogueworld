
const Pickup = require('./Pickup');

class PickupSuperBloodStaff extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupSuperBloodStaff;

PickupSuperBloodStaff.prototype.registerEntityType();
PickupSuperBloodStaff.prototype.ItemType = require('../../../items/holdable/weapons/ItemSuperBloodStaff');
