
const Pickup = require('./Pickup');

class PickupExpOrbArmoury extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupExpOrbArmoury;

PickupExpOrbArmoury.prototype.registerEntityType();
PickupExpOrbArmoury.prototype.ItemType = require('../../../items/ItemExpOrbArmoury');
