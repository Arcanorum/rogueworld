
const Weapon = require('./Weapon');

class ItemDungiumSword extends Weapon {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemDungiumSword;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjDungiumSword');

ItemDungiumSword.prototype.registerItemType();
ItemDungiumSword.prototype.idName = "Dungium sword";
ItemDungiumSword.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupDungiumSword');
ItemDungiumSword.prototype.ProjectileType = ProjectileType;
ItemDungiumSword.prototype.iconSource = "icon-dungium-sword";
ItemDungiumSword.prototype.baseValue = 10;
ItemDungiumSword.prototype.category = Weapon.prototype.categories.Weapon;
ItemDungiumSword.prototype.baseDurability = 50;
ItemDungiumSword.prototype.useDurabilityCost = 1;
ItemDungiumSword.prototype.useEnergyCost = 1;
ItemDungiumSword.prototype.expGivenStatName = ItemDungiumSword.prototype.StatNames.Melee;
ItemDungiumSword.prototype.expGivenOnUse = 10;