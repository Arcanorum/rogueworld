
const Item = require('./Item');

class ItemOakLogs extends Item {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemOakLogs;

ItemOakLogs.prototype.registerItemType();
ItemOakLogs.prototype.idName = "Oak logs";
ItemOakLogs.prototype.PickupType = require('../entities/destroyables/pickups/PickupOakLogs');
ItemOakLogs.prototype.baseValue = 10;
ItemOakLogs.prototype.craftingExpValue = 10;
ItemOakLogs.prototype.iconSource = "icon-oak-logs";