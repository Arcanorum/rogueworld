
const Item = require('./Item');

class ItemExpOrbRanged extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemExpOrbRanged;

ItemExpOrbRanged.prototype.registerItemType();
ItemExpOrbRanged.prototype.idName = "Exp orb: Ranged";
ItemExpOrbRanged.prototype.PickupType = require('../entities/destroyables/pickups/PickupExpOrbRanged');
ItemExpOrbRanged.prototype.baseValue = 10;
ItemExpOrbRanged.prototype.craftingExpValue = 10;
ItemExpOrbRanged.prototype.iconSource = "icon-exp-orb";
ItemExpOrbRanged.prototype.expGivenStatName = ItemExpOrbRanged.prototype.StatNames.Ranged;
ItemExpOrbRanged.prototype.expGivenOnUse = 100;
ItemExpOrbRanged.prototype.baseDurability = 1;
ItemExpOrbRanged.prototype.useDurabilityCost = 1;