
const Ammunition = require('./Ammunition');

class ItemIronArrows extends Ammunition {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemIronArrows;

ItemIronArrows.prototype.registerItemType();
ItemIronArrows.prototype.idName = "Iron arrows";
ItemIronArrows.prototype.PickupType = require('../../entities/destroyables/pickups/PickupIronArrows');
ItemIronArrows.prototype.ProjectileType = require('../../entities/destroyables/movables/projectiles/ProjIronArrow');
ItemIronArrows.prototype.baseValue = 10;
ItemIronArrows.prototype.baseDurability = 50;
ItemIronArrows.prototype.useDurabilityCost = 1;
ItemIronArrows.prototype.iconSource = "icon-iron-arrows";
