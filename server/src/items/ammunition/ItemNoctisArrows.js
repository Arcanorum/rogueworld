
const Ammunition = require('./Ammunition');

class ItemNoctisArrows extends Ammunition {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemNoctisArrows;

ItemNoctisArrows.prototype.registerItemType();
ItemNoctisArrows.prototype.idName = "Noctis arrows";
ItemNoctisArrows.prototype.PickupType = require('../../entities/destroyables/pickups/PickupNoctisArrows');
ItemNoctisArrows.prototype.ProjectileType = require('../../entities/destroyables/movables/projectiles/ProjNoctisArrow');
ItemNoctisArrows.prototype.baseValue = 10;
ItemNoctisArrows.prototype.baseDurability = 25;
ItemNoctisArrows.prototype.useDurabilityCost = 1;
ItemNoctisArrows.prototype.iconSource = "icon-noctis-arrows";
