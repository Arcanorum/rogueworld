
const Pickup = require('./Pickup');

class PickupDungiumHammer extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupDungiumHammer;

PickupDungiumHammer.prototype.registerEntityType();
PickupDungiumHammer.prototype.ItemType = require('../../../items/holdable/weapons/ItemDungiumHammer');
