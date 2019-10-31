
const Item = require('./Item');

class ItemCotton extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemCotton;

ItemCotton.prototype.registerItemType();
ItemCotton.prototype.idName = "Cotton";
ItemCotton.prototype.PickupType = require('../entities/destroyables/pickups/PickupCotton');
ItemCotton.prototype.baseValue = 10;
ItemCotton.prototype.craftingExpValue = 5;
ItemCotton.prototype.iconSource = "icon-cotton";
