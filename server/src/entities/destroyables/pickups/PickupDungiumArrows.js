
const Pickup = require('./Pickup');

class PickupDungiumArrows extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupDungiumArrows;

PickupDungiumArrows.prototype.registerEntityType();
PickupDungiumArrows.prototype.ItemType = require('../../../items/ammunition/ItemDungiumArrows');
