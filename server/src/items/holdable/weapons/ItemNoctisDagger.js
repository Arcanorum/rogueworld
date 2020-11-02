
const Weapon = require('./Weapon');

class ItemNoctisDagger extends Weapon {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemNoctisDagger;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjNoctisDagger');

ItemNoctisDagger.prototype.registerItemType();
ItemNoctisDagger.prototype.idName = "Noctis dagger";
ItemNoctisDagger.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupNoctisDagger');
ItemNoctisDagger.prototype.ProjectileType = ProjectileType;
ItemNoctisDagger.prototype.iconSource = "icon-noctis-dagger";
ItemNoctisDagger.prototype.baseValue = 10;
ItemNoctisDagger.prototype.category = Weapon.prototype.categories.Weapon;
ItemNoctisDagger.prototype.baseDurability = 50;
ItemNoctisDagger.prototype.useDurabilityCost = 1;
ItemNoctisDagger.prototype.useEnergyCost = 1;
ItemNoctisDagger.prototype.expGivenStatName = ItemNoctisDagger.prototype.StatNames.Melee;