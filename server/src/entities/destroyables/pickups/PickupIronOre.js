
const Pickup = require('./Pickup');

class PickupIronOre extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupIronOre;

PickupIronOre.prototype.registerEntityType();
PickupIronOre.prototype.ItemType = require('../../../items/ItemIronOre');
