
const Item = require('./Item');

class ItemFirLogs extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemFirLogs;

ItemFirLogs.prototype.registerItemType();
ItemFirLogs.prototype.idName = "Fir logs";
ItemFirLogs.prototype.PickupType = require('../entities/destroyables/pickups/PickupFirLogs');
ItemFirLogs.prototype.baseValue = 10;
ItemFirLogs.prototype.craftingExpValue = 10;
ItemFirLogs.prototype.iconSource = "icon-fir-logs";