
const Weapon = require('./Weapon');

class ItemHammerOfGlory extends Weapon {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemHammerOfGlory;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjHammerOfGlory');

ItemHammerOfGlory.prototype.registerItemType();
ItemHammerOfGlory.prototype.idName = "Hammer of glory";
ItemHammerOfGlory.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupHammerOfGlory');
ItemHammerOfGlory.prototype.ProjectileType = ProjectileType;
ItemHammerOfGlory.prototype.useGloryCost = 15;
ItemHammerOfGlory.prototype.iconSource = "icon-iron-hammer";
ItemHammerOfGlory.prototype.category = Weapon.prototype.categories.Weapon;
ItemHammerOfGlory.prototype.expGivenStatName = ItemHammerOfGlory.prototype.StatNames.Melee;