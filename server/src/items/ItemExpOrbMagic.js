
const Item = require('./Item');

class ItemExpOrbMagic extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemExpOrbMagic;

ItemExpOrbMagic.prototype.registerItemType();
ItemExpOrbMagic.prototype.idName = "Exp orb: Magic";
ItemExpOrbMagic.prototype.PickupType = require('../entities/destroyables/pickups/PickupExpOrbMagic');
ItemExpOrbMagic.prototype.baseValue = 10;
ItemExpOrbMagic.prototype.craftingExpValue = 10;
ItemExpOrbMagic.prototype.iconSource = "icon-exp-orb";
ItemExpOrbMagic.prototype.expGivenStatName = ItemExpOrbMagic.prototype.StatNames.Magic;
ItemExpOrbMagic.prototype.expGivenOnUse = 100;
ItemExpOrbMagic.prototype.baseDurability = 1;
ItemExpOrbMagic.prototype.useDurabilityCost = 1;