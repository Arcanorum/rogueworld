
const Item = require('./Item');

class ItemNoctisOre extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemNoctisOre;

ItemNoctisOre.prototype.registerItemType();
ItemNoctisOre.prototype.idName = "Noctis ore";
ItemNoctisOre.prototype.PickupType = require('../entities/destroyables/pickups/PickupNoctisOre');
ItemNoctisOre.prototype.baseValue = 10;
ItemNoctisOre.prototype.iconSource = "icon-noctis-ore";
