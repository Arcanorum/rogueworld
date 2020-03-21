
const Weapon = require('./Weapon');

class ItemNoctisHammer extends Weapon {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemNoctisHammer;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjNoctisHammer');

ItemNoctisHammer.prototype.registerItemType();
ItemNoctisHammer.prototype.idName = "Noctis hammer";
ItemNoctisHammer.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupNoctisHammer');
ItemNoctisHammer.prototype.ProjectileType = ProjectileType;
ItemNoctisHammer.prototype.iconSource = "icon-noctis-hammer";
ItemNoctisHammer.prototype.baseValue = 10;
ItemNoctisHammer.prototype.category = Weapon.prototype.categories.Weapon;
ItemNoctisHammer.prototype.baseDurability = 50;
ItemNoctisHammer.prototype.useDurabilityCost = 1;
ItemNoctisHammer.prototype.useEnergyCost = 1;
ItemNoctisHammer.prototype.expGivenStatName = ItemNoctisHammer.prototype.StatNames.Melee;