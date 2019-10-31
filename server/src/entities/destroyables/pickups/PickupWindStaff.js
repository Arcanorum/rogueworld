
const Pickup = require('./Pickup');

class PickupWindStaff extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupWindStaff;

PickupWindStaff.prototype.registerEntityType();
PickupWindStaff.prototype.ItemType = require('../../../items/holdable/weapons/ItemWindStaff');
