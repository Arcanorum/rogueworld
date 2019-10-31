
const Item = require('./Item');

class ItemString extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemString;

ItemString.prototype.registerItemType();
ItemString.prototype.idName = "String";
ItemString.prototype.PickupType = require('../entities/destroyables/pickups/PickupString');
ItemString.prototype.baseValue = 10;
ItemString.prototype.craftingExpValue = 10;
ItemString.prototype.iconSource = "icon-string";
