
const Item = require('./Item');

class ItemDungiumBar extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemDungiumBar;

ItemDungiumBar.prototype.registerItemType();
ItemDungiumBar.prototype.idName = "Dungium bar";
ItemDungiumBar.prototype.PickupType = require('../entities/destroyables/pickups/PickupDungiumBar');
ItemDungiumBar.prototype.baseValue = 10;
ItemDungiumBar.prototype.iconSource = "icon-dungium-bar";

