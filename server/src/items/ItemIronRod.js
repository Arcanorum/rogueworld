
const Item = require('./Item');

class ItemIronRod extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemIronRod;

ItemIronRod.prototype.registerItemType();
ItemIronRod.prototype.idName = "Iron rod";
ItemIronRod.prototype.PickupType = require('../entities/destroyables/pickups/PickupIronRod');
ItemIronRod.prototype.baseValue = 20;
ItemIronRod.prototype.iconSource = "icon-iron-rod";
