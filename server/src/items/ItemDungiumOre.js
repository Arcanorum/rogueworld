
const Item = require('./Item');

class ItemDungiumOre extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemDungiumOre;

ItemDungiumOre.prototype.registerItemType();
ItemDungiumOre.prototype.idName = "Dungium ore";
ItemDungiumOre.prototype.PickupType = require('../entities/destroyables/pickups/PickupDungiumOre');
ItemDungiumOre.prototype.baseValue = 10;
ItemDungiumOre.prototype.craftingExpValue = 10;
ItemDungiumOre.prototype.iconSource = "icon-dungium-ore";

