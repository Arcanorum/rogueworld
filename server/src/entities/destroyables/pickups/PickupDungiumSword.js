
const Pickup = require('./Pickup');

class PickupDungiumSword extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupDungiumSword;

PickupDungiumSword.prototype.registerEntityType();
PickupDungiumSword.prototype.ItemType = require('../../../items/holdable/weapons/ItemDungiumSword');
