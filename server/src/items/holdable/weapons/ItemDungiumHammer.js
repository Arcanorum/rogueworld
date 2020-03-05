
const Weapon = require('./Weapon');

class ItemDungiumHammer extends Weapon {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemDungiumHammer;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjDungiumHammer');

ItemDungiumHammer.prototype.registerItemType();
ItemDungiumHammer.prototype.idName = "Dungium hammer";
ItemDungiumHammer.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupDungiumHammer');
ItemDungiumHammer.prototype.ProjectileType = ProjectileType;
ItemDungiumHammer.prototype.iconSource = "icon-dungium-hammer";
ItemDungiumHammer.prototype.baseValue = 10;
ItemDungiumHammer.prototype.category = Weapon.prototype.categories.Weapon;
ItemDungiumHammer.prototype.baseDurability = 50;
ItemDungiumHammer.prototype.useDurabilityCost = 1;
ItemDungiumHammer.prototype.useEnergyCost = 1;
ItemDungiumHammer.prototype.expGivenStatName = ItemDungiumHammer.prototype.StatNames.Melee;