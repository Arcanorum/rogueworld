
const Item = require('./Item');

class ItemNoctisSheet extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemNoctisSheet;

ItemNoctisSheet.prototype.registerItemType();
ItemNoctisSheet.prototype.idName = "Noctis sheet";
ItemNoctisSheet.prototype.PickupType = require('../entities/destroyables/pickups/PickupNoctisSheet');
ItemNoctisSheet.prototype.baseValue = 10;
ItemNoctisSheet.prototype.iconSource = "icon-noctis-sheet";
