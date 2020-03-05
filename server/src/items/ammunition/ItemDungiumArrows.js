
const Ammunition = require('./Ammunition');

class ItemDungiumArrows extends Ammunition {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemDungiumArrows;

ItemDungiumArrows.prototype.registerItemType();
ItemDungiumArrows.prototype.idName = "Dungium arrows";
ItemDungiumArrows.prototype.PickupType = require('../../entities/destroyables/pickups/PickupDungiumArrows');
ItemDungiumArrows.prototype.ProjectileType = require('../../entities/destroyables/movables/projectiles/ProjDungiumArrow');
ItemDungiumArrows.prototype.baseValue = 10;
ItemDungiumArrows.prototype.baseDurability = 50;
ItemDungiumArrows.prototype.useDurabilityCost = 1;
ItemDungiumArrows.prototype.iconSource = "icon-dungium-arrows";
