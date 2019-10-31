
const Item = require('./Item');

class ItemFireGem extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemFireGem;

ItemFireGem.prototype.registerItemType();
ItemFireGem.prototype.idName = "Fire gem";
ItemFireGem.prototype.PickupType = require('../entities/destroyables/pickups/PickupFireGem');
ItemFireGem.prototype.baseValue = 10;
ItemFireGem.prototype.craftingExpValue = 40;
ItemFireGem.prototype.iconSource = "icon-fire-gem";
