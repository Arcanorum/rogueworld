
const Pickup = require('./Pickup');

class PickupDungiumRod extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupDungiumRod;

PickupDungiumRod.prototype.registerEntityType();
PickupDungiumRod.prototype.ItemType = require('../../../items/ItemDungiumRod');
