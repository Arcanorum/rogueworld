
const Item = require('./Item');

class ItemExpOrbToolery extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemExpOrbToolery;

ItemExpOrbToolery.prototype.registerItemType();
ItemExpOrbToolery.prototype.idName = "Exp orb: Toolery";
ItemExpOrbToolery.prototype.PickupType = require('../entities/destroyables/pickups/PickupExpOrbToolery');
ItemExpOrbToolery.prototype.baseValue = 10;
ItemExpOrbToolery.prototype.craftingExpValue = 10;
ItemExpOrbToolery.prototype.iconSource = "icon-exp-orb";
ItemExpOrbToolery.prototype.expGivenStatName = ItemExpOrbToolery.prototype.StatNames.Toolery;
ItemExpOrbToolery.prototype.expGivenOnUse = 100;
ItemExpOrbToolery.prototype.baseDurability = 1;
ItemExpOrbToolery.prototype.useDurabilityCost = 1;