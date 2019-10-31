
const Weapon = require('./Weapon');

class ItemFireStaff extends Weapon {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemFireStaff;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjFire');

ItemFireStaff.prototype.registerItemType();
ItemFireStaff.prototype.idName = "Fire staff";
ItemFireStaff.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupFireStaff');
ItemFireStaff.prototype.ProjectileType = ProjectileType;
ItemFireStaff.prototype.iconSource = "icon-fire-staff";
ItemFireStaff.prototype.baseValue = 10;
ItemFireStaff.prototype.category = Weapon.prototype.categories.Weapon;
ItemFireStaff.prototype.baseDurability = 25;
ItemFireStaff.prototype.useDurabilityCost = 1;
ItemFireStaff.prototype.useEnergyCost = 1;
ItemFireStaff.prototype.expGivenStatName = ItemFireStaff.prototype.StatNames.Magic;