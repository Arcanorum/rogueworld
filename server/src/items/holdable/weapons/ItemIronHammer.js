
const Weapon = require('./Weapon');

class ItemIronHammer extends Weapon {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemIronHammer;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjIronHammer');

ItemIronHammer.prototype.registerItemType();
ItemIronHammer.prototype.idName = "Iron hammer";
ItemIronHammer.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupIronHammer');
ItemIronHammer.prototype.ProjectileType = ProjectileType;
ItemIronHammer.prototype.iconSource = "icon-iron-hammer";
ItemIronHammer.prototype.baseValue = 10;
ItemIronHammer.prototype.category = Weapon.prototype.categories.Weapon;
ItemIronHammer.prototype.baseDurability = 25;
ItemIronHammer.prototype.useDurabilityCost = 1;
ItemIronHammer.prototype.useEnergyCost = 1;
ItemIronHammer.prototype.expGivenStatName = ItemIronHammer.prototype.StatNames.Melee;