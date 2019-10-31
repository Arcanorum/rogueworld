
const Pickup = require('./Pickup');

class PickupDungiumSheet extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupDungiumSheet;

PickupDungiumSheet.prototype.registerEntityType();
PickupDungiumSheet.prototype.ItemType = require('../../../items/ItemDungiumSheet');
