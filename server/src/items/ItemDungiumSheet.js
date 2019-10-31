
const Item = require('./Item');

class ItemDungiumSheet extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemDungiumSheet;

ItemDungiumSheet.prototype.registerItemType();
ItemDungiumSheet.prototype.idName = "Dungium sheet";
ItemDungiumSheet.prototype.PickupType = require('../entities/destroyables/pickups/PickupDungiumSheet');
ItemDungiumSheet.prototype.baseValue = 10;
ItemDungiumSheet.prototype.craftingExpValue = 10;
ItemDungiumSheet.prototype.iconSource = "icon-dungium-sheet";

