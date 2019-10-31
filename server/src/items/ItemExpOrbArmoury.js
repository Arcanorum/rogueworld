
const Item = require('./Item');

class ItemExpOrbArmoury extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemExpOrbArmoury;

ItemExpOrbArmoury.prototype.registerItemType();
ItemExpOrbArmoury.prototype.idName = "Exp orb: Armoury";
ItemExpOrbArmoury.prototype.PickupType = require('../entities/destroyables/pickups/PickupExpOrbArmoury');
ItemExpOrbArmoury.prototype.baseValue = 10;
ItemExpOrbArmoury.prototype.craftingExpValue = 10;
ItemExpOrbArmoury.prototype.iconSource = "icon-exp-orb";
ItemExpOrbArmoury.prototype.expGivenStatName = ItemExpOrbArmoury.prototype.StatNames.Armoury;
ItemExpOrbArmoury.prototype.expGivenOnUse = 100;
ItemExpOrbArmoury.prototype.baseDurability = 1;
ItemExpOrbArmoury.prototype.useDurabilityCost = 1;