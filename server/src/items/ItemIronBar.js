
const Item = require('./Item');

class ItemIronBar extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemIronBar;

ItemIronBar.prototype.registerItemType();
ItemIronBar.prototype.idName = "Iron bar";
ItemIronBar.prototype.PickupType = require('../entities/destroyables/pickups/PickupIronBar');
ItemIronBar.prototype.baseValue = 20;
ItemIronBar.prototype.iconSource = "icon-iron-bar";
