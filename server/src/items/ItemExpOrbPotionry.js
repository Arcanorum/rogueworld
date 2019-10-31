
const Item = require('./Item');

class ItemExpOrbPotionry extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemExpOrbPotionry;

ItemExpOrbPotionry.prototype.registerItemType();
ItemExpOrbPotionry.prototype.idName = "Exp orb: Potionry";
ItemExpOrbPotionry.prototype.PickupType = require('../entities/destroyables/pickups/PickupExpOrbPotionry');
ItemExpOrbPotionry.prototype.baseValue = 10;
ItemExpOrbPotionry.prototype.craftingExpValue = 10;
ItemExpOrbPotionry.prototype.iconSource = "icon-exp-orb";
ItemExpOrbPotionry.prototype.expGivenStatName = ItemExpOrbPotionry.prototype.StatNames.Potionry;
ItemExpOrbPotionry.prototype.expGivenOnUse = 100;
ItemExpOrbPotionry.prototype.baseDurability = 1;
ItemExpOrbPotionry.prototype.useDurabilityCost = 1;