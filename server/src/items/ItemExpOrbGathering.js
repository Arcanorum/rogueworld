
const Item = require('./Item');

class ItemExpOrbGathering extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemExpOrbGathering;

ItemExpOrbGathering.prototype.registerItemType();
ItemExpOrbGathering.prototype.idName = "Exp orb: Gathering";
ItemExpOrbGathering.prototype.PickupType = require('../entities/destroyables/pickups/PickupExpOrbGathering');
ItemExpOrbGathering.prototype.baseValue = 10;
ItemExpOrbGathering.prototype.craftingExpValue = 10;
ItemExpOrbGathering.prototype.iconSource = "icon-exp-orb";
ItemExpOrbGathering.prototype.expGivenStatName = ItemExpOrbGathering.prototype.StatNames.Gathering;
ItemExpOrbGathering.prototype.expGivenOnUse = 100;
ItemExpOrbGathering.prototype.baseDurability = 1;
ItemExpOrbGathering.prototype.useDurabilityCost = 1;