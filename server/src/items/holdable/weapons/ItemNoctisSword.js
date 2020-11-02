
const Weapon = require('./Weapon');

class ItemNoctisSword extends Weapon {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemNoctisSword;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjNoctisSword');

ItemNoctisSword.prototype.registerItemType();
ItemNoctisSword.prototype.idName = "Noctis sword";
ItemNoctisSword.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupNoctisSword');
ItemNoctisSword.prototype.ProjectileType = ProjectileType;
ItemNoctisSword.prototype.iconSource = "icon-noctis-sword";
ItemNoctisSword.prototype.baseValue = 10;
ItemNoctisSword.prototype.category = Weapon.prototype.categories.Weapon;
ItemNoctisSword.prototype.baseDurability = 50;
ItemNoctisSword.prototype.useDurabilityCost = 1;
ItemNoctisSword.prototype.useEnergyCost = 1;
ItemNoctisSword.prototype.expGivenStatName = ItemNoctisSword.prototype.StatNames.Melee;
ItemNoctisSword.prototype.expGivenOnUse = 10;