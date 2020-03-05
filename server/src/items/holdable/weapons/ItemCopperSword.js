
const Weapon = require('./Weapon');

class ItemCopperSword extends Weapon {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemCopperSword;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjCopperSword');

ItemCopperSword.prototype.registerItemType();
ItemCopperSword.prototype.idName = "Copper sword";
ItemCopperSword.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupCopperSword');
ItemCopperSword.prototype.ProjectileType = ProjectileType;
ItemCopperSword.prototype.iconSource = "icon-copper-sword";
ItemCopperSword.prototype.baseValue = 10;
ItemCopperSword.prototype.category = Weapon.prototype.categories.Weapon;
ItemCopperSword.prototype.baseDurability = 50;
ItemCopperSword.prototype.useDurabilityCost = 1;
ItemCopperSword.prototype.useEnergyCost = 1;
ItemCopperSword.prototype.expGivenStatName = ItemCopperSword.prototype.StatNames.Melee;
