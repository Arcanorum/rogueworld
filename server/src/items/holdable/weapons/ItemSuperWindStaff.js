
const Weapon = require('./Weapon');

class ItemSuperWindStaff extends Weapon {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemSuperWindStaff;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjSuperWind');

ItemSuperWindStaff.prototype.registerItemType();
ItemSuperWindStaff.prototype.idName = "Super wind staff";
ItemSuperWindStaff.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupSuperWindStaff');
ItemSuperWindStaff.prototype.ProjectileType = ProjectileType;
ItemSuperWindStaff.prototype.iconSource = "icon-super-wind-staff";
ItemSuperWindStaff.prototype.baseValue = 50;
ItemSuperWindStaff.prototype.category = Weapon.prototype.categories.Weapon;
ItemSuperWindStaff.prototype.baseDurability = 30;
ItemSuperWindStaff.prototype.useDurabilityCost = 1;
ItemSuperWindStaff.prototype.useEnergyCost = 3;
ItemSuperWindStaff.prototype.expGivenStatName = ItemSuperWindStaff.prototype.StatNames.Magic;
ItemSuperWindStaff.prototype.canUseIntoHighBlockedTile = false;