
const Pickup = require('./Pickup');

class PickupDungiumPickaxe extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupDungiumPickaxe;

PickupDungiumPickaxe.prototype.registerEntityType();
PickupDungiumPickaxe.prototype.ItemType = require('../../../items/ItemDungiumPickaxe');
