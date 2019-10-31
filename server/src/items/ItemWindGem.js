
const Item = require('./Item');

class ItemWindGem extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemWindGem;

ItemWindGem.prototype.registerItemType();
ItemWindGem.prototype.idName = "Wind gem";
ItemWindGem.prototype.PickupType = require('../entities/destroyables/pickups/PickupWindGem');
ItemWindGem.prototype.baseValue = 10;
ItemWindGem.prototype.craftingExpValue = 40;
ItemWindGem.prototype.iconSource = "icon-wind-gem";
