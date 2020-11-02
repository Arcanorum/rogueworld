
const Weapon = require('./Weapon');

class ItemSuperFireStaff extends Weapon {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemSuperFireStaff;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjSuperFire');

ItemSuperFireStaff.prototype.registerItemType();
ItemSuperFireStaff.prototype.idName = "Super fire staff";
ItemSuperFireStaff.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupSuperFireStaff');
ItemSuperFireStaff.prototype.ProjectileType = ProjectileType;
ItemSuperFireStaff.prototype.iconSource = "icon-super-fire-staff";
ItemSuperFireStaff.prototype.baseValue = 50;
ItemSuperFireStaff.prototype.category = Weapon.prototype.categories.Weapon;
ItemSuperFireStaff.prototype.baseDurability = 30;
ItemSuperFireStaff.prototype.useDurabilityCost = 1;
ItemSuperFireStaff.prototype.useEnergyCost = 3;
ItemSuperFireStaff.prototype.expGivenStatName = ItemSuperFireStaff.prototype.StatNames.Magic;
ItemSuperFireStaff.prototype.canUseIntoHighBlockedTile = false;