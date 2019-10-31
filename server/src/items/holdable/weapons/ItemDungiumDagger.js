
const Weapon = require('./Weapon');

class ItemDungiumDagger extends Weapon {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemDungiumDagger;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjDungiumDagger');

ItemDungiumDagger.prototype.registerItemType();
ItemDungiumDagger.prototype.idName = "Dungium dagger";
ItemDungiumDagger.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupDungiumDagger');
ItemDungiumDagger.prototype.ProjectileType = ProjectileType;
ItemDungiumDagger.prototype.iconSource = "icon-dungium-dagger";
ItemDungiumDagger.prototype.baseValue = 10;
ItemDungiumDagger.prototype.category = Weapon.prototype.categories.Weapon;
ItemDungiumDagger.prototype.baseDurability = 35;
ItemDungiumDagger.prototype.useDurabilityCost = 1;
ItemDungiumDagger.prototype.useEnergyCost = 1;
ItemDungiumDagger.prototype.expGivenStatName = ItemDungiumDagger.prototype.StatNames.Melee;