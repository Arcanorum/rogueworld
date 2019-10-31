
const Weapon = require('./Weapon');

class ItemShuriken extends Weapon {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemShuriken;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjShuriken');

ItemShuriken.prototype.registerItemType();
ItemShuriken.prototype.idName = "Shuriken";
ItemShuriken.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupShuriken');
ItemShuriken.prototype.ProjectileType = ProjectileType;
ItemShuriken.prototype.iconSource = "icon-shuriken";
ItemShuriken.prototype.baseValue = 10;
ItemShuriken.prototype.category = Weapon.prototype.categories.Weapon;
ItemShuriken.prototype.baseDurability = 20;
ItemShuriken.prototype.useDurabilityCost = 1;
ItemShuriken.prototype.useEnergyCost = 1;
ItemShuriken.prototype.expGivenStatName = ItemShuriken.prototype.StatNames.Ranged;
ItemShuriken.prototype.expGivenOnUse = 10;