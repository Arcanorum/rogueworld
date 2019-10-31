
const Item = require('./Item');

class ItemIronSheet extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemIronSheet;

ItemIronSheet.prototype.registerItemType();
ItemIronSheet.prototype.idName = "Iron sheet";
ItemIronSheet.prototype.PickupType = require('../entities/destroyables/pickups/PickupIronSheet');
ItemIronSheet.prototype.baseValue = 20;
ItemIronSheet.prototype.iconSource = "icon-iron-sheet";
