
const Item = require('./Item');

class ItemBloodGem extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemBloodGem;

ItemBloodGem.prototype.registerItemType();
ItemBloodGem.prototype.idName = "Blood gem";
ItemBloodGem.prototype.PickupType = require('../entities/destroyables/pickups/PickupBloodGem');
ItemBloodGem.prototype.baseValue = 10;
ItemBloodGem.prototype.craftingExpValue = 40;
ItemBloodGem.prototype.iconSource = "icon-blood-gem";
