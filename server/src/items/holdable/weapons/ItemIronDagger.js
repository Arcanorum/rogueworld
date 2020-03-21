
const Weapon = require('./Weapon');

class ItemIronDagger extends Weapon {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemIronDagger;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjIronDagger');

ItemIronDagger.prototype.registerItemType();
ItemIronDagger.prototype.idName = "Iron dagger";
ItemIronDagger.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupIronDagger');
ItemIronDagger.prototype.ProjectileType = ProjectileType;
ItemIronDagger.prototype.iconSource = "icon-iron-dagger";
ItemIronDagger.prototype.baseValue = 10;
ItemIronDagger.prototype.category = Weapon.prototype.categories.Weapon;
ItemIronDagger.prototype.baseDurability = 50;
ItemIronDagger.prototype.useDurabilityCost = 1;
ItemIronDagger.prototype.useEnergyCost = 1;
ItemIronDagger.prototype.expGivenStatName = ItemIronDagger.prototype.StatNames.Melee;