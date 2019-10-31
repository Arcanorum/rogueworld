
const Item = require('./Item');

class ItemNoctisRod extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemNoctisRod;

ItemNoctisRod.prototype.registerItemType();
ItemNoctisRod.prototype.idName = "Noctis rod";
ItemNoctisRod.prototype.PickupType = require('../entities/destroyables/pickups/PickupNoctisRod');
ItemNoctisRod.prototype.baseValue = 10;
ItemNoctisRod.prototype.iconSource = "icon-noctis-rod";
