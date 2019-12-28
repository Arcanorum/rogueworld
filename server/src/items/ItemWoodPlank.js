
const Item = require('./Item');

class ItemWoodPlank extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemWoodPlank;

ItemWoodPlank.prototype.registerItemType();
ItemWoodPlank.prototype.idName = "Wood plank";
ItemWoodPlank.prototype.PickupType = require('../entities/destroyables/pickups/PickupWoodWall');
ItemWoodPlank.prototype.baseValue = 10;
ItemWoodPlank.prototype.craftingExpValue = 20;
ItemWoodPlank.prototype.iconSource = "icon-wood-plank";
