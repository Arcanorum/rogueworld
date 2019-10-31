
const Item = require('./Item');

class ItemDungiumRod extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemDungiumRod;

ItemDungiumRod.prototype.registerItemType();
ItemDungiumRod.prototype.idName = "Dungium rod";
ItemDungiumRod.prototype.PickupType = require('../entities/destroyables/pickups/PickupDungiumRod');
ItemDungiumRod.prototype.baseValue = 10;
ItemDungiumRod.prototype.craftingExpValue = 10;
ItemDungiumRod.prototype.iconSource = "icon-dungium-rod";

