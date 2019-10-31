
const Pickup = require('./Pickup');

class PickupDungiumBar extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupDungiumBar;

PickupDungiumBar.prototype.registerEntityType();
PickupDungiumBar.prototype.ItemType = require('../../../items/ItemDungiumBar');
