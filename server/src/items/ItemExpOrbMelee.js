
const Item = require('./Item');

class ItemExpOrbMelee extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemExpOrbMelee;

ItemExpOrbMelee.prototype.registerItemType();
ItemExpOrbMelee.prototype.idName = "Exp orb: Melee";
ItemExpOrbMelee.prototype.PickupType = require('../entities/destroyables/pickups/PickupExpOrbMelee');
ItemExpOrbMelee.prototype.baseValue = 10;
ItemExpOrbMelee.prototype.craftingExpValue = 10;
ItemExpOrbMelee.prototype.iconSource = "icon-exp-orb";
ItemExpOrbMelee.prototype.expGivenStatName = ItemExpOrbMelee.prototype.StatNames.Melee;
ItemExpOrbMelee.prototype.expGivenOnUse = 100;
ItemExpOrbMelee.prototype.baseDurability = 1;
ItemExpOrbMelee.prototype.useDurabilityCost = 1;