
const Item = require('./Item');

class ItemFabric extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemFabric;

ItemFabric.prototype.registerItemType();
ItemFabric.prototype.idName = "Fabric";
ItemFabric.prototype.PickupType = require('../entities/destroyables/pickups/PickupFabric');
ItemFabric.prototype.baseValue = 10;
ItemFabric.prototype.craftingExpValue = 10;
ItemFabric.prototype.iconSource = "icon-fabric";
