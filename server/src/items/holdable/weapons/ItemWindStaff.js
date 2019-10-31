
const Weapon = require('./Weapon');

class ItemWindStaff extends Weapon {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemWindStaff;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjWind');

ItemWindStaff.prototype.registerItemType();
ItemWindStaff.prototype.idName = "Wind staff";
ItemWindStaff.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupWindStaff');
ItemWindStaff.prototype.ProjectileType = ProjectileType;
ItemWindStaff.prototype.iconSource = "icon-wind-staff";
ItemWindStaff.prototype.baseValue = 10;
ItemWindStaff.prototype.category = Weapon.prototype.categories.Weapon;
ItemWindStaff.prototype.baseDurability = 25;
ItemWindStaff.prototype.useDurabilityCost = 1;
ItemWindStaff.prototype.useEnergyCost = 1;
ItemWindStaff.prototype.expGivenStatName = ItemWindStaff.prototype.StatNames.Magic;