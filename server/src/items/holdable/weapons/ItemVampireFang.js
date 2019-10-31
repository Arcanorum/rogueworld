
const Weapon = require('./Weapon');

class ItemVampireFang extends Weapon {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemVampireFang;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjVampireFang');

ItemVampireFang.prototype.registerItemType();
ItemVampireFang.prototype.idName = "Vampire fang";
ItemVampireFang.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupVampireFang');
ItemVampireFang.prototype.ProjectileType = ProjectileType;
ItemVampireFang.prototype.iconSource = "icon-vampire-fang";
ItemVampireFang.prototype.baseValue = 10;
ItemVampireFang.prototype.category = Weapon.prototype.categories.Weapon;
ItemVampireFang.prototype.baseDurability = 25;
ItemVampireFang.prototype.useDurabilityCost = 1;
ItemVampireFang.prototype.useEnergyCost = 1;
ItemVampireFang.prototype.expGivenStatName = ItemVampireFang.prototype.StatNames.Melee;
ItemVampireFang.prototype.expGivenOnUse = 10;