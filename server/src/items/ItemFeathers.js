
const Item = require('./Item');

class ItemFeathers extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemFeathers;

ItemFeathers.prototype.registerItemType();
ItemFeathers.prototype.idName = "Feathers";
ItemFeathers.prototype.PickupType = require('../entities/destroyables/pickups/PickupFeathers');
ItemFeathers.prototype.baseValue = 10;
ItemFeathers.prototype.craftingExpValue = 10;
ItemFeathers.prototype.iconSource = "icon-feathers";
