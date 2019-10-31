
const Pickup = require('./Pickup');

class PickupFireStaff extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupFireStaff;

PickupFireStaff.prototype.registerEntityType();
PickupFireStaff.prototype.ItemType = require('../../../items/holdable/weapons/ItemFireStaff');
