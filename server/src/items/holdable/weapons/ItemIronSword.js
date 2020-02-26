const Weapon = require('./Weapon');

class ItemIronSword extends Weapon {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemIronSword;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjIronSword');

ItemIronSword.prototype.registerItemType();
ItemIronSword.prototype.idName = "Iron sword";
ItemIronSword.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupIronSword');
ItemIronSword.prototype.ProjectileType = ProjectileType;
ItemIronSword.prototype.iconSource = "icon-iron-sword";
ItemIronSword.prototype.baseValue = 10;
ItemIronSword.prototype.category = Weapon.prototype.categories.Weapon;
ItemIronSword.prototype.baseDurability = 25;
ItemIronSword.prototype.useDurabilityCost = 1;
ItemIronSword.prototype.useEnergyCost = 1;
ItemIronSword.prototype.expGivenStatName = ItemIronSword.prototype.StatNames.Melee;
