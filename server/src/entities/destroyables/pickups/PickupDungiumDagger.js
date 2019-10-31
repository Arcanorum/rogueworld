
const Pickup = require('./Pickup');

class PickupDungiumDagger extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupDungiumDagger;

PickupDungiumDagger.prototype.registerEntityType();
PickupDungiumDagger.prototype.ItemType = require('../../../items/holdable/weapons/ItemDungiumDagger');
