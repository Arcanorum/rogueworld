
const Pickup = require('./Pickup');

class PickupIronSheet extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupIronSheet;

PickupIronSheet.prototype.registerEntityType();
PickupIronSheet.prototype.ItemType = require('../../../items/ItemIronSheet');
