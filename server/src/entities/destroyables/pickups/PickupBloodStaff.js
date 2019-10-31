
const Pickup = require('./Pickup');

class PickupBloodStaff extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupBloodStaff;

PickupBloodStaff.prototype.registerEntityType();
PickupBloodStaff.prototype.ItemType = require('../../../items/holdable/weapons/ItemBloodStaff');
