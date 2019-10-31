
const Pickup = require('./Pickup');

class PickupDungiumHatchet extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupDungiumHatchet;

PickupDungiumHatchet.prototype.registerEntityType();
PickupDungiumHatchet.prototype.ItemType = require('../../../items/ItemDungiumHatchet');
