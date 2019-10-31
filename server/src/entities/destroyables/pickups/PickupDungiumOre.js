
const Pickup = require('./Pickup');

class PickupDungiumOre extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupDungiumOre;

PickupDungiumOre.prototype.registerEntityType();
PickupDungiumOre.prototype.ItemType = require('../../../items/ItemDungiumOre');
