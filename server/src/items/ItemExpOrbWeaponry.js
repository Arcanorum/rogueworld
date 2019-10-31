
const Item = require('./Item');

class ItemExpOrbWeaponry extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemExpOrbWeaponry;

ItemExpOrbWeaponry.prototype.registerItemType();
ItemExpOrbWeaponry.prototype.idName = "Exp orb: Weaponry";
ItemExpOrbWeaponry.prototype.PickupType = require('../entities/destroyables/pickups/PickupExpOrbWeaponry');
ItemExpOrbWeaponry.prototype.baseValue = 10;
ItemExpOrbWeaponry.prototype.craftingExpValue = 10;
ItemExpOrbWeaponry.prototype.iconSource = "icon-exp-orb";
ItemExpOrbWeaponry.prototype.expGivenStatName = ItemExpOrbWeaponry.prototype.StatNames.Weaponry;
ItemExpOrbWeaponry.prototype.expGivenOnUse = 100;
ItemExpOrbWeaponry.prototype.baseDurability = 1;
ItemExpOrbWeaponry.prototype.useDurabilityCost = 1;