
const Item = require('./Item');

class ItemNoctisBar extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemNoctisBar;

ItemNoctisBar.prototype.registerItemType();
ItemNoctisBar.prototype.idName = "Noctis bar";
ItemNoctisBar.prototype.PickupType = require('../entities/destroyables/pickups/PickupNoctisBar');
ItemNoctisBar.prototype.baseValue = 10;
ItemNoctisBar.prototype.iconSource = "icon-noctis-bar";
