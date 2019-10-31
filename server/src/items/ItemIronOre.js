
const Item = require('./Item');

class ItemIronOre extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemIronOre;

ItemIronOre.prototype.registerItemType();
ItemIronOre.prototype.idName = "Iron ore";
ItemIronOre.prototype.PickupType = require('../entities/destroyables/pickups/PickupIronOre');
ItemIronOre.prototype.baseValue = 10;
ItemIronOre.prototype.iconSource = "icon-iron-ore";

